# 🚀 Performance Optimization Deployment Guide

**Date**: October 16, 2025  
**Target Database**: `impulsep_gq` (MySQL/MariaDB)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] **Backup database** (CRITICAL!)
- [ ] **Test in development first**
- [ ] **Verify NestJS build succeeds**
- [ ] **Review all changes**
- [ ] **Plan rollback strategy**

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### **Step 1: Backup Database** ⚠️ CRITICAL

```bash
# Create backup before any changes
mysqldump -u your_username -p impulsep_gq > backup_before_optimization_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -lh backup_before_optimization_*.sql
```

---

### **Step 2: Apply Database Indexes** (5 minutes)

#### **Option A: Using MySQL Command Line**
```bash
cd "/Users/citlogistics/Desktop/Flutter Projects/Moonsun/Glamour/nestJs"

# Apply indexes
mysql -u your_username -p impulsep_gq < migrations/performance_indexes.sql

# Check for errors
echo $?  # Should return 0 if successful
```

#### **Option B: Using phpMyAdmin**
1. Open phpMyAdmin
2. Select database `impulsep_gq`
3. Go to "SQL" tab
4. Copy contents of `migrations/performance_indexes.sql`
5. Click "Go"
6. Verify "Query OK" messages

---

### **Step 3: Verify Indexes Created**

```sql
-- Check sales_orders indexes
SHOW INDEX FROM sales_orders WHERE Key_name LIKE 'idx_%';

-- Check ClientStock indexes  
SHOW INDEX FROM ClientStock WHERE Key_name LIKE 'idx_%';

-- Check UpliftSale indexes
SHOW INDEX FROM UpliftSale WHERE Key_name LIKE 'idx_%';

-- Check ClientAssignment indexes
SHOW INDEX FROM ClientAssignment WHERE Key_name LIKE 'idx_%';

-- Check all new indexes across tables
SELECT 
  TABLE_NAME,
  INDEX_NAME,
  COLUMN_NAME,
  SEQ_IN_INDEX
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'impulsep_gq'
  AND INDEX_NAME LIKE 'idx_%'
  AND INDEX_NAME IN (
    'idx_sales_orders_salesrep_created',
    'idx_sales_order_items_order_product',
    'idx_clientstock_product_client_qty',
    'idx_upliftsale_user_created',
    'idx_upliftsaleitem_product_sale',
    'idx_clientassignment_salesrep_status_outlet',
    'idx_clients_country_status_region_route',
    'idx_journeyplan_user_status_date',
    'idx_salesclient_payment_client_date',
    'idx_sample_request_user_status'
  )
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
```

**Expected Output**: Should show ~16 new indexes created

---

### **Step 4: Deploy NestJS Code Changes**

```bash
cd "/Users/citlogistics/Desktop/Flutter Projects/Moonsun/Glamour/nestJs"

# Install dependencies (if needed)
npm install

# Build project
npm run build

# Verify build succeeded
echo $?  # Should return 0

# Check dist folder created
ls -la dist/
```

---

### **Step 5: Test in Development**

```bash
# Start development server
npm run start:dev

# In another terminal, test endpoints:
# Test Orders API
curl -X GET "http://localhost:3000/api/orders" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -w "\nTime: %{time_total}s\n"

# Test Clients API with pagination
curl -X GET "http://localhost:3000/api/clients?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -w "\nTime: %{time_total}s\n"

# Test Uplift Sales API
curl -X GET "http://localhost:3000/api/uplift-sales?userId=2" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -w "\nTime: %{time_total}s\n"
```

**Expected Results**:
- ✅ All endpoints return data
- ✅ Response time < 500ms
- ✅ No errors in console
- ✅ Pagination working (clients endpoint)

---

### **Step 6: Monitor Performance**

#### **A. Check Query Performance**
```sql
-- Enable slow query logging (if not already enabled)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- Log queries > 1 second

-- After some usage, check slow queries
SELECT 
  sql_text,
  query_time,
  lock_time,
  rows_examined,
  rows_sent
FROM mysql.slow_log
WHERE start_time > NOW() - INTERVAL 1 HOUR
ORDER BY query_time DESC
LIMIT 20;
```

#### **B. Check Index Usage**
```sql
-- See which indexes are being used
EXPLAIN SELECT * FROM sales_orders 
WHERE salesrep = 2 
ORDER BY created_at DESC 
LIMIT 50;

-- Should show:
-- type: ref (good) or range (ok)
-- key: idx_sales_orders_salesrep_created
-- rows: small number (not scanning entire table)
```

#### **C. Monitor Database Connections**
```sql
-- Check active connections
SHOW PROCESSLIST;

-- Check connection pool usage
SHOW STATUS LIKE 'Threads%';
SHOW STATUS LIKE 'Max_used_connections';
```

---

### **Step 7: Update Flutter App** (if API responses changed)

The pagination changes require minimal Flutter app updates:

```dart
// Old:
final clients = await ApiService.getClients();

// New (backward compatible - works without params):
final response = await ApiService.getClients(page: 1, limit: 50);

// Response format:
// {
//   "data": [...],      // Array of clients
//   "total": 1000,      // Total count
//   "page": 1,          // Current page
//   "totalPages": 20    // Total pages
// }
```

**Note**: The service should be backward compatible - if no pagination params, it defaults to page=1, limit=50.

---

## 📊 PERFORMANCE MONITORING

### **Metrics to Track**:

```
Metric                    Target      Command
─────────────────────────────────────────────────────────
Response Time (P95)       < 500ms     Check via Postman/curl
Database CPU              < 50%       SHOW STATUS
Active Connections        < 10/15     SHOW PROCESSLIST
Slow Queries (>1s)        0/min       Check mysql.slow_log
Cache Hit Rate            > 90%       Check app logs
Error Rate                < 1%        Check app logs
```

---

## 🔄 ROLLBACK PLAN

If any issues occur:

### **1. Rollback Database Indexes**
```bash
# Drop new indexes
mysql -u username -p impulsep_gq <<EOF
-- Drop all new indexes (in reverse order)
DROP INDEX IF EXISTS idx_sample_request_user_status ON sample_request;
DROP INDEX IF EXISTS idx_salesclient_payment_client_date ON salesclient_payment;
DROP INDEX IF EXISTS idx_tasks_salesrep_status_due ON tasks;
DROP INDEX IF EXISTS idx_journeyplan_user_status_date ON JourneyPlan;
DROP INDEX IF EXISTS idx_clients_country_status_region_route ON Clients;
DROP INDEX IF EXISTS idx_clientassignment_salesrep_status_outlet ON ClientAssignment;
DROP INDEX IF EXISTS idx_upliftsale_user_created ON UpliftSale;
DROP INDEX IF EXISTS idx_clientstock_product_client_qty ON ClientStock;
DROP INDEX IF EXISTS idx_sales_orders_salesrep_created ON sales_orders;
EOF
```

### **2. Rollback Code Changes**
```bash
cd nestJs/src

# Restore original files from git
git checkout orders/orders.service.ts
git checkout uplift-sales/uplift-sales.service.ts
git checkout clients/clients.service.ts
git checkout client-assignment/client-assignment.service.ts

# Rebuild
npm run build
```

### **3. Restore Database (if major issues)**
```bash
# Only if critical issues! This will lose recent data!
mysql -u username -p impulsep_gq < backup_before_optimization_YYYYMMDD_HHMMSS.sql
```

---

## ✅ POST-DEPLOYMENT VALIDATION

### **Test Each Optimized Endpoint**:

```bash
TOKEN="your_jwt_token_here"

# 1. Test Orders (should be fast now)
time curl -X GET "http://localhost:3000/api/orders" \
  -H "Authorization: Bearer $TOKEN"
# Expected: < 200ms for 100 orders

# 2. Test Clients (with pagination)
time curl -X GET "http://localhost:3000/api/clients?page=1&limit=50" \
  -H "Authorization: Bearer $TOKEN"
# Expected: < 300ms for page of 50

# 3. Test Uplift Sales
time curl -X GET "http://localhost:3000/api/uplift-sales?userId=2" \
  -H "Authorization: Bearer $TOKEN"
# Expected: < 300ms for 50 sales

# 4. Test Client Assignments (should hit cache)
time curl -X GET "http://localhost:3000/api/clients" \
  -H "Authorization: Bearer $TOKEN"
# First call: ~200ms, Second call: ~50ms (cached!)
```

---

## 🎯 SUCCESS CRITERIA

Mark deployment as successful if:

- ✅ All indexes created without errors
- ✅ NestJS build successful
- ✅ All API endpoints respond correctly
- ✅ Response times improved by > 80%
- ✅ No increase in error rates
- ✅ Database CPU usage decreased
- ✅ Cache hit rate > 80% (check logs)

---

## 📈 EXPECTED RESULTS

### **Before Optimization**:
```
GET /api/orders (100 orders)
└── Queries: 1,301
└── Time: 2,500ms
└── Payload: 2MB
└── DB CPU: 80%

GET /api/clients (1,000 clients)
└── Queries: 800
└── Time: 5,000ms  
└── Payload: 5MB
└── DB CPU: 90%
```

### **After Optimization**:
```
GET /api/orders (100 orders)
└── Queries: 1 ⚡
└── Time: 150ms ⚡⚡⚡
└── Payload: 300KB ⚡⚡
└── DB CPU: 20% ⚡⚡

GET /api/clients (page 1 of 20)
└── Queries: 100 ⚡⚡
└── Time: 200ms ⚡⚡⚡
└── Payload: 50KB ⚡⚡⚡
└── DB CPU: 25% ⚡⚡
```

---

## 🛠️ TROUBLESHOOTING

### **Issue: "Index already exists" error**
```sql
-- Some indexes might already exist (that's ok!)
-- MySQL will skip them with "IF NOT EXISTS"
-- Check if index exists:
SHOW INDEX FROM sales_orders WHERE Key_name = 'idx_sales_orders_salesrep_created';
```

### **Issue: Slow index creation**
```
-- Large tables (>1M rows) may take time to index
-- Estimated times:
-- - 100K rows: ~30 seconds
-- - 1M rows: ~5 minutes
-- - 10M rows: ~30 minutes

-- Monitor progress:
SHOW PROCESSLIST;
```

### **Issue: Out of disk space**
```bash
# Indexes require disk space (~10-20% of table size)
# Check available space:
df -h

# If low, consider:
# 1. Clean old backups
# 2. Add indexes in batches
# 3. Upgrade disk space
```

### **Issue: Lock timeouts during index creation**
```sql
-- If production database is heavily used:
-- 1. Apply indexes during low-traffic hours
-- 2. Or use ALGORITHM=INPLACE for non-blocking:
CREATE INDEX idx_name ON table(column) ALGORITHM=INPLACE, LOCK=NONE;
```

---

## 📞 SUPPORT

If issues occur:
1. Check NestJS logs: `npm run start:dev`
2. Check MySQL error log: `/var/log/mysql/error.log`
3. Review slow query log
4. Check this deployment guide
5. Refer to `PERFORMANCE_FIXES_SUMMARY.md`

---

## 🎉 COMPLETION

After successful deployment:

1. ✅ Update `PERFORMANCE_FIXES_SUMMARY.md` with actual metrics
2. ✅ Document any issues encountered
3. ✅ Share performance improvements with team
4. ✅ Monitor for 24-48 hours
5. ✅ Plan next optimization phase (Redis, etc.)

---

**Deployed By**: [Your Name]  
**Date**: [Deployment Date]  
**Status**: [ ] Success [ ] Partial [ ] Rollback Required


