# ✅ COMPLETE RECHARTS → CHART.JS MIGRATION GUIDE

## 📊 Analysis Complete: 18 Files Using Recharts

---

## 🎯 MIGRATION COMPLETED

### ✅ **AdminEmissions.tsx** - DONE
- **Charts Migrated:** Line Chart (trend), Bar Chart (departments)
- **Status:** Fully functional with Chart.js
- **Location:** `/src/app/pages/AdminEmissions.tsx`

---

## 📋 REMAINING 17 FILES TO MIGRATE

### **Critical Dashboards (Do These First)**

#### 1. **EmissionsOverview.tsx** ⭐ PRIORITY 1
- **Charts:** AreaChart, PieChart
- **Lines:** 32-43
- **Complexity:** Medium

#### 2. **SustainabilityOverview.tsx** ⭐ PRIORITY 1  
- **Charts:** AreaChart, BarChart, LineChart
- **Lines:** 44-53
- **Complexity:** High

#### 3. **AdminOverview.tsx** ⭐ PRIORITY 1
- **Charts:** LineChart, PieChart
- **Lines:** 17-22
- **Complexity:** Medium

#### 4. **EmployeeDashboard.tsx** ⭐ PRIORITY 2
- **Charts:** AreaChart
- **Lines:** 28-33
- **Complexity:** Low

---

### **Analytics Pages**

#### 5. **EmissionsTrends.tsx**
- **Charts:** AreaChart, LineChart
- **Lines:** 30-35
- **Complexity:** Medium

#### 6. **ModeSplit.tsx**
- **Charts:** PieChart, BarChart, LineChart
- **Lines:** 32-37
- **Complexity:** High

#### 7. **MyImpact.tsx**
- **Charts:** AreaChart, BarChart
- **Lines:** 56-61
- **Complexity:** Medium

#### 8. **AdminParticipation.tsx**
- **Charts:** BarChart, LineChart
- **Lines:** 43-48
- **Complexity:** Medium

---

### **Location & Targets**

#### 9. **LocationPerformance.tsx**
- **Charts:** BarChart, RadarChart ⚠️
- **Lines:** 40-45
- **Complexity:** High (includes Radar)

#### 10. **TargetsTrajectory.tsx**
- **Charts:** AreaChart, LineChart
- **Lines:** 40-45
- **Complexity:** Medium

#### 11. **ScenarioModeling.tsx**
- **Charts:** LineChart
- **Lines:** 30-35
- **Complexity:** Low

---

### **Auditor Pages**

#### 12. **AuditorOverview.tsx**
- **Charts:** PieChart, BarChart
- **Lines:** 30-35
- **Complexity:** Medium

---

### **Super Admin**

#### 13. **SuperAdminDashboard.tsx**
- **Charts:** AreaChart, BarChart
- **Lines:** 37-42
- **Complexity:** Medium

#### 14. **SystemHealth.tsx**
- **Charts:** LineChart, AreaChart
- **Lines:** 20-25
- **Complexity:** Low

#### 15. **UsageAnalytics.tsx**
- **Charts:** LineChart, BarChart, PieChart
- **Lines:** 30-35
- **Complexity:** High

---

### **Components**

#### 16. **CSRDComplianceDashboard.tsx** (Component)
- **Charts:** LineChart, BarChart, RadarChart ⚠️
- **Lines:** 32
- **Complexity:** High

#### 17. **PublicTransportAnalytics.tsx** (Component)
- **Charts:** BarChart, LineChart, PieChart
- **Lines:** 41-46
- **Complexity:** High

---

## 🔄 MIGRATION TEMPLATE

Use this template for each file:

### **Step 1: Update Imports**

```typescript
// ❌ REMOVE THIS:
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ✅ REPLACE WITH:
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  lineChartOptions, 
  barChartOptions, 
  doughnutChartOptions, 
  colors 
} from '../utils/chartConfig';
```

---

### **Step 2: Convert Charts**

#### **AreaChart → Line Chart (filled)**

```typescript
// ❌ BEFORE (Recharts):
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Area 
      type="monotone" 
      dataKey="actual" 
      stroke="#3b82f6" 
      fill="url(#colorActual)" 
      name="Actual Emissions"
    />
  </AreaChart>
</ResponsiveContainer>

// ✅ AFTER (Chart.js):
<div style={{ height: '300px' }}>
  <Line
    data={{
      labels: monthlyData.map(d => d.month),
      datasets: [{
        label: 'Actual Emissions',
        data: monthlyData.map(d => d.actual),
        borderColor: colors.chart.blue,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      }]
    }}
    options={lineChartOptions}
  />
</div>
```

---

#### **BarChart → Bar Chart**

```typescript
// ❌ BEFORE (Recharts):
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={departmentData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#3b82f6" name="Emissions" />
  </BarChart>
</ResponsiveContainer>

// ✅ AFTER (Chart.js):
<div style={{ height: '300px' }}>
  <Bar
    data={{
      labels: departmentData.map(d => d.name),
      datasets: [{
        label: 'Emissions',
        data: departmentData.map(d => d.value),
        backgroundColor: colors.chart.green,
      }]
    }}
    options={barChartOptions}
  />
</div>
```

---

#### **PieChart → Doughnut Chart**

```typescript
// ❌ BEFORE (Recharts):
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={modeData}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={renderCustomizedLabel}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {modeData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>

// ✅ AFTER (Chart.js):
<div style={{ height: '300px' }}>
  <Doughnut
    data={{
      labels: modeData.map(d => d.name),
      datasets: [{
        data: modeData.map(d => d.value),
        backgroundColor: [
          colors.chart.green,
          colors.chart.blue,
          colors.chart.orange,
          colors.chart.purple,
          colors.chart.cyan,
        ],
        borderWidth: 0,
      }]
    }}
    options={doughnutChartOptions}
  />
</div>
```

---

#### **LineChart → Line Chart**

```typescript
// ❌ BEFORE (Recharts):
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={trendData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual" />
    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target" />
  </LineChart>
</ResponsiveContainer>

// ✅ AFTER (Chart.js):
<div style={{ height: '300px' }}>
  <Line
    data={{
      labels: trendData.map(d => d.month),
      datasets: [
        {
          label: 'Actual',
          data: trendData.map(d => d.actual),
          borderColor: colors.chart.blue,
          backgroundColor: 'transparent',
          fill: false,
        },
        {
          label: 'Target',
          data: trendData.map(d => d.target),
          borderColor: colors.chart.red,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          fill: false,
        }
      ]
    }}
    options={lineChartOptions}
  />
</div>
```

---

#### **RadarChart → Radar Chart** ⚠️

```typescript
// First, install Radar chart type:
import { Radar } from 'react-chartjs-2';

// ❌ BEFORE (Recharts):
<ResponsiveContainer width="100%" height={300}>
  <RadarChart data={radarData}>
    <PolarGrid />
    <PolarAngleAxis dataKey="metric" />
    <PolarRadiusAxis />
    <Radar name="Location" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
  </RadarChart>
</ResponsiveContainer>

// ✅ AFTER (Chart.js):
<div style={{ height: '300px' }}>
  <Radar
    data={{
      labels: radarData.map(d => d.metric),
      datasets: [{
        label: 'Location',
        data: radarData.map(d => d.value),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: colors.chart.blue,
        borderWidth: 2,
      }]
    }}
    options={{
      scales: {
        r: {
          beginAtZero: true,
        }
      }
    }}
  />
</div>
```

---

## 🎨 Color Reference

Use these colors from `chartConfig.ts`:

```typescript
import { colors } from '../utils/chartConfig';

// Brand Colors
colors.chart.green    // #00bc7d (primary)
colors.chart.blue     // #3b82f6
colors.chart.purple   // #8b5cf6
colors.chart.orange   // #f97316
colors.chart.red      // #ef4444
colors.chart.yellow   // #eab308
colors.chart.cyan     // #06b6d4
colors.chart.emerald  // #10b981

// For transparency:
'rgba(0, 188, 125, 0.1)'  // Green with 10% opacity
'rgba(59, 130, 246, 0.1)' // Blue with 10% opacity
```

---

## ✅ MIGRATION CHECKLIST

For each file:

- [ ] Update imports (remove Recharts, add Chart.js)
- [ ] Remove `ResponsiveContainer` wrapper
- [ ] Add `<div style={{ height: '300px' }}>` wrapper
- [ ] Convert data structure (labels + datasets)
- [ ] Update colors using `colors.chart.*`
- [ ] Remove gradient definitions (defs)
- [ ] Test chart rendering
- [ ] Verify tooltips work
- [ ] Check responsive behavior

---

## ⏱️ Time Estimate

- **Simple file** (1-2 charts): 10-15 minutes
- **Medium file** (3-4 charts): 20-30 minutes
- **Complex file** (5+ charts or Radar): 30-45 minutes

**Total for all 17 files:** ~5-6 hours

---

## 🚀 Recommended Order

1. ✅ AdminEmissions.tsx (DONE)
2. EmissionsOverview.tsx ⭐
3. SustainabilityOverview.tsx ⭐
4. AdminOverview.tsx ⭐
5. EmployeeDashboard.tsx
6. MyImpact.tsx
7. EmissionsTrends.tsx
8. ModeSplit.tsx
9. AdminParticipation.tsx
10. AuditorOverview.tsx
11. TargetsTrajectory.tsx
12. ScenarioModeling.tsx
13. SuperAdminDashboard.tsx
14. SystemHealth.tsx
15. UsageAnalytics.tsx
16. LocationPerformance.tsx (has Radar)
17. CSRDComplianceDashboard.tsx (component)
18. PublicTransportAnalytics.tsx (component)

---

## 💡 Tips

1. **Test incrementally:** Migrate one chart at a time
2. **Use ChartJSExample.tsx:** Reference for patterns
3. **Keep data structures:** Only change the chart rendering
4. **Preserve colors:** Use the color mapping above
5. **Check height:** Chart.js needs explicit height on container

---

## 🎯 Quick Find & Replace

In VS Code, use these patterns:

**Find:**
```
} from 'recharts';
```

**Replace:**
```
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { lineChartOptions, barChartOptions, doughnutChartOptions, colors } from '../utils/chartConfig';
```

---

**Find:**
```
<ResponsiveContainer width="100%" height={300}>
```

**Replace:**
```
<div style={{ height: '300px' }}>
```

---

**Find:**
```
</ResponsiveContainer>
```

**Replace:**
```
</div>
```

---

## 📞 Need Help?

Reference these files:
- `/src/app/pages/AdminEmissions.tsx` (✅ Completed example)
- `/src/app/pages/ChartJSExample.tsx` (All chart types)
- `/src/app/utils/chartConfig.ts` (Configuration)
- `/CHARTJS_LOCATION_GUIDE.md` (Documentation)

---

## ✅ SUMMARY

- **Total Files:** 18
- **Completed:** 1 (AdminEmissions.tsx)
- **Remaining:** 17
- **Est. Time:** 5-6 hours
- **Status:** Migration template ready
- **Next:** Choose priority files to migrate

---

**You now have everything needed to complete the migration!** 🚀

Would you like me to:
1. Migrate the top 3 priority files (EmissionsOverview, SustainabilityOverview, AdminOverview)?
2. Create a migration script?
3. Focus on specific files?
