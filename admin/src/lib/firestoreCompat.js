import { supabase } from "../config/firebase";

export function collection(db, collectionName) {
  return { __type: "collection", collection: collectionName };
}

export function doc(db, collectionName, id) {
  return { __type: "doc", collection: collectionName, id };
}

export function where(field, op, value) {
  return { __type: "where", field, op, value };
}

export function query(ref, ...clauses) {
  return { __type: "query", ref, clauses };
}

function applyWhere(qb, clause) {
  if (clause.field.includes(".")) {
    const [root, ...rest] = clause.field.split(".");
    const jsonSelector = `${root}->>${rest.join(".")}`;
    if (clause.op === "==") return qb.filter(jsonSelector, "eq", clause.value);
    if (clause.op === "!=") return qb.filter(jsonSelector, "neq", clause.value);
    return qb;
  }

  if (clause.op === "==") return qb.eq(clause.field, clause.value);
  if (clause.op === "!=") return qb.neq(clause.field, clause.value);
  return qb;
}

function setByPath(target, path, value) {
  const keys = path.split(".");
  let cursor = target;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (typeof cursor[key] !== "object" || cursor[key] === null) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }

  cursor[keys[keys.length - 1]] = value;
}

export async function getDocs(refOrQuery) {
  if (refOrQuery.__type === "collection") {
    const { data, error } = await supabase.from(refOrQuery.collection).select("*");
    if (error) throw error;
    return {
      docs: (data || []).map((row) => ({ id: row.id, data: () => row })),
      empty: !data || data.length === 0,
    };
  }

  if (refOrQuery.__type === "query") {
    let qb = supabase.from(refOrQuery.ref.collection).select("*");
    for (const clause of refOrQuery.clauses || []) {
      if (clause.__type === "where") qb = applyWhere(qb, clause);
    }
    const { data, error } = await qb;
    if (error) throw error;
    return {
      docs: (data || []).map((row) => ({ id: row.id, data: () => row })),
      empty: !data || data.length === 0,
    };
  }

  throw new Error("Unsupported getDocs reference");
}

export async function updateDoc(docRef, updates) {
  const hasNestedUpdate = Object.keys(updates).some((key) => key.includes("."));
  let payload = updates;

  if (hasNestedUpdate) {
    const { data: existing, error: findError } = await supabase
      .from(docRef.collection)
      .select("*")
      .eq("id", docRef.id)
      .maybeSingle();
    if (findError) throw findError;

    payload = { ...(existing || {}) };
    for (const [key, value] of Object.entries(updates)) {
      if (key.includes(".")) {
        setByPath(payload, key, value);
      } else {
        payload[key] = value;
      }
    }
    delete payload.id;
  }

  const { error } = await supabase.from(docRef.collection).update(payload).eq("id", docRef.id);
  if (error) throw error;
}
