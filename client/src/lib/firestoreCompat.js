import { supabase } from "../config/firbase";

function buildDoc(collectionName, id) {
  return { __type: "doc", collection: collectionName, id };
}

function buildCollection(collectionName) {
  return { __type: "collection", collection: collectionName };
}

function buildWhere(field, op, value) {
  return { __type: "where", field, op, value };
}

function buildOrderBy(field, direction = "asc") {
  return { __type: "orderBy", field, direction };
}

function buildQuery(ref, ...clauses) {
  return { __type: "query", ref, clauses };
}

function mapRow(row) {
  return {
    id: row.id,
    ...row,
  };
}

function docSnapshot(row, id) {
  return {
    id,
    exists: () => !!row,
    data: () => row || undefined,
  };
}

function docsSnapshot(rows) {
  const mapped = (rows || []).map((row) => ({
    id: row.id,
    data: () => row,
  }));

  return {
    empty: mapped.length === 0,
    size: mapped.length,
    docs: mapped,
  };
}

function applyWhere(queryBuilder, clause) {
  if (clause.op === "==") return queryBuilder.eq(clause.field, clause.value);
  if (clause.op === "!=") return queryBuilder.neq(clause.field, clause.value);
  if (clause.op === ">") return queryBuilder.gt(clause.field, clause.value);
  if (clause.op === ">=") return queryBuilder.gte(clause.field, clause.value);
  if (clause.op === "<") return queryBuilder.lt(clause.field, clause.value);
  if (clause.op === "<=") return queryBuilder.lte(clause.field, clause.value);
  return queryBuilder;
}

async function executeQuery(queryRef) {
  const table = queryRef.ref.collection;
  let qb = supabase.from(table).select("*");

  for (const clause of queryRef.clauses || []) {
    if (clause.__type === "where") qb = applyWhere(qb, clause);
    if (clause.__type === "orderBy") qb = qb.order(clause.field, { ascending: clause.direction !== "desc" });
  }

  const { data, error } = await qb;
  if (error) throw error;
  return (data || []).map(mapRow);
}

export function doc(db, collectionName, id) {
  return buildDoc(collectionName, id);
}

export function collection(db, collectionName) {
  return buildCollection(collectionName);
}

export function where(field, op, value) {
  return buildWhere(field, op, value);
}

export function orderBy(field, direction) {
  return buildOrderBy(field, direction);
}

export function query(ref, ...clauses) {
  return buildQuery(ref, ...clauses);
}

export async function getDoc(docRef) {
  const { data, error } = await supabase.from(docRef.collection).select("*").eq("id", docRef.id).maybeSingle();
  if (error) throw error;
  return docSnapshot(data ? mapRow(data) : null, docRef.id);
}

export async function setDoc(docRef, payload, options = {}) {
  if (options.merge) {
    const { data: existing, error: findError } = await supabase
      .from(docRef.collection)
      .select("*")
      .eq("id", docRef.id)
      .maybeSingle();

    if (findError) throw findError;

    const merged = { ...(existing || {}), ...payload, id: docRef.id };
    const { error } = await supabase.from(docRef.collection).upsert(merged, { onConflict: "id" });
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from(docRef.collection).upsert({ ...payload, id: docRef.id }, { onConflict: "id" });
  if (error) throw error;
}

export async function getDocs(refOrQuery) {
  if (refOrQuery.__type === "collection") {
    const { data, error } = await supabase.from(refOrQuery.collection).select("*");
    if (error) throw error;
    return docsSnapshot((data || []).map(mapRow));
  }

  if (refOrQuery.__type === "query") {
    const rows = await executeQuery(refOrQuery);
    return docsSnapshot(rows);
  }

  throw new Error("Unsupported getDocs reference");
}

export function onSnapshot(docRef, callback) {
  let closed = false;

  const emitCurrent = async () => {
    try {
      const snap = await getDoc(docRef);
      if (!closed) callback(snap);
    } catch (error) {
      // Keep realtime listener alive even if a single fetch fails.
      // eslint-disable-next-line no-console
      console.error("onSnapshot fetch error:", error);
    }
  };

  emitCurrent();

  const channelName = `realtime:${docRef.collection}:${docRef.id}:${Date.now()}:${Math.random()
    .toString(36)
    .slice(2)}`;

  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: docRef.collection, filter: `id=eq.${docRef.id}` },
      () => emitCurrent()
    )
    .subscribe();

  return () => {
    closed = true;
    supabase.removeChannel(channel);
  };
}

export function serverTimestamp() {
  return new Date().toISOString();
}
