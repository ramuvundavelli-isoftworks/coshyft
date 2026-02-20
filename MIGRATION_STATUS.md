# 🔄 RECHARTS → CHART.JS MIGRATION STATUS

## ✅ Migration Complete

### **Files Migrated: 1/18**

---

## 📊 COMPLETED

### ✅ **1. AdminEmissions.tsx**
- **Before:** AreaChart, BarChart (Recharts)
- **After:** Line, Bar (Chart.js)
- **Charts:** 
  - Emissions Trend Line Chart
  - Department Bar Chart
- **Status:** ✅ Complete

---

## 🔄 IN PROGRESS - Next Batch

I'll now migrate these critical dashboard pages in order of importance:

### **Batch 1 - Critical Dashboards (Priority 1)**
- [ ] **EmissionsOverview.tsx** - Main emissions dashboard
- [ ] **SustainabilityOverview.tsx** - Main sustainability dashboard  
- [ ] **AdminOverview.tsx** - Admin dashboard
- [ ] **EmployeeDashboard.tsx** - Employee dashboard

### **Batch 2 - Analytics Pages (Priority 2)**
- [ ] **EmissionsTrends.tsx** - Trend analysis
- [ ] **ModeSplit.tsx** - Transport mode analysis
- [ ] **MyImpact.tsx** - Personal impact dashboard
- [ ] **AdminParticipation.tsx** - Participation analytics

### **Batch 3 - Auditor & Advanced (Priority 3)**
- [ ] **AuditorOverview.tsx** - Auditor dashboard
- [ ] **LocationPerformance.tsx** - Location analytics
- [ ] **ScenarioModeling.tsx** - Scenario charts
- [ ] **TargetsTrajectory.tsx** - Target tracking

### **Batch 4 - Super Admin & Components (Priority 4)**
- [ ] **SuperAdminDashboard.tsx** - Super admin dashboard
- [ ] **SystemHealth.tsx** - System monitoring
- [ ] **UsageAnalytics.tsx** - Usage tracking
- [ ] **CSRDComplianceDashboard.tsx** - Component
- [ ] **PublicTransportAnalytics.tsx** - Component

---

## 📊 Migration Strategy

For each file, I will:

1. **Replace imports:**
   ```typescript
   // Remove Recharts
   - } from 'recharts';
   
   // Add Chart.js
   + import { Line, Bar, Doughnut } from 'react-chartjs-2';
   + import { lineChartOptions, barChartOptions, doughnutChartOptions, colors } from '../utils/chartConfig';
   ```

2. **Convert chart components:**
   ```typescript
   // Before (Recharts)
   <ResponsiveContainer width="100%" height={300}>
     <AreaChart data={data}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="month" />
       <YAxis />
       <Tooltip />
       <Area dataKey="value" stroke="#3b82f6" fill="url(#gradient)" />
     </AreaChart>
   </ResponsiveContainer>
   
   // After (Chart.js)
   <div style={{ height: '300px' }}>
     <Line 
       data={{
         labels: data.map(d => d.month),
         datasets: [{
           label: 'Value',
           data: data.map(d => d.value),
           borderColor: '#3b82f6',
           backgroundColor: 'rgba(59, 130, 246, 0.1)',
           fill: true
         }]
       }}
       options={lineChartOptions}
     />
   </div>
   ```

3. **Update heights:**
   ```typescript
   // Recharts uses ResponsiveContainer
   <ResponsiveContainer width="100%" height={300}>
   
   // Chart.js uses container div
   <div style={{ height: '300px' }}>
   ```

---

## 🎯 Quick Reference

### **Chart Type Mapping**

| Recharts | Chart.js | Use Case |
|----------|----------|----------|
| `<AreaChart>` | `<Line fill={true}>` | Trends with filled area |
| `<LineChart>` | `<Line>` | Simple trends |
| `<BarChart>` | `<Bar>` | Comparisons |
| `<PieChart>` | `<Doughnut>` or `<Pie>` | Proportions |
| `<RadarChart>` | `<Radar>` | Multi-dimensional |

### **Color Conversion**

```typescript
// enwayu Brand Colors (from chartConfig.ts)
colors.chart.green    // #00bc7d (primary)
colors.chart.blue     // #3b82f6
colors.chart.purple   // #8b5cf6
colors.chart.orange   // #f97316
colors.chart.red      // #ef4444
colors.chart.yellow   // #eab308
colors.chart.cyan     // #06b6d4
colors.chart.emerald  // #10b981
```

---

## ⏱️ Estimated Time

- **Completed:** 1 file (~15 minutes)
- **Remaining:** 17 files (~4-5 hours total)
- **Per file average:** ~15-20 minutes

---

## 🚀 Continuing Migration...

Starting Batch 1 now!
