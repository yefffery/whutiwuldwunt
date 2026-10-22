WITH RECURSIVE slots(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM slots WHERE n < 100
)
INSERT OR IGNORE INTO care_keys_inventory (slot_index,key_code,current_state,updated_at)
SELECT n,'WIWW-BAY-'||printf('%02d',n),'available',CAST(strftime('%s','now') AS INTEGER)*1000
FROM slots;
