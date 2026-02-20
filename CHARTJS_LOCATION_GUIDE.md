# 📍 CHART.JS LOCATION GUIDE

## ✅ Where Chart.js is Added

### **1. Package Installed** ✅
**Location:** `/package.json`
```json
{
  "dependencies": {
    "chart.js": "^4.5.1",
    "react-chartjs-2": "^5.3.1"
  }
}
```

---

### **2. Configuration File** ✅
**Location:** `/src/app/utils/chartConfig.ts`

**What's inside:**
- Complete Chart.js setup
- enwayu brand colors
- Pre-configured chart options for:
  - Line charts
  - Bar charts
  - Area charts
  - Doughnut charts
- Example data structures
- Helper functions

**How to use:**
```typescript
import { lineChartOptions, colors } from '../utils/chartConfig';
```

---

### **3. Example Page** ✅
**Location:** `/src/app/pages/ChartJSExample.tsx`

**How to access:**
Navigate to: **`/chartjs-examples`**

**What you'll see:**
- Line chart example
- Bar chart example
- Doughnut chart example
- Area chart example
- Multi-dataset chart
- Custom styled chart
- Complete usage instructions
- Benefits comparison

---

### **4. Added to Routing** ✅
**Location:** `/src/app/routes.ts` (line ~104)

```typescript
// Developer/Testing Routes
{ path: 'chartjs-examples', Component: ChartJSExample },
```

---

## 🎯 How to Access Chart.js Examples

### **Option 1: Direct URL**
Type in browser address bar:
```
http://localhost:PORT/chartjs-examples
```

### **Option 2: Navigate from any page**
In your browser console:
```javascript
window.location.href = '/chartjs-examples'
```

### **Option 3: Add to Navigation (Optional)**
You can add a link in your sidebar/navigation:

```typescript
// In your navigation config
{
  title: 'Chart.js Examples',
  path: '/chartjs-examples',
  icon: BarChart3,
  badge: 'NEW'
}
```

---

## 📊 Pages Currently Using Recharts

These pages could be migrated to Chart.js:

### **1. AdminEmissions.tsx**
**Location:** `/src/app/pages/AdminEmissions.tsx`
**Current:** Recharts AreaChart, BarChart
**Lines:** 180-210

**Charts used:**
- Emissions Trend (AreaChart)
- Department Emissions (BarChart)

### **2. Other pages using Recharts**
Search for: `from 'recharts'`

To find all pages:
```bash
grep -r "from 'recharts'" src/app/pages/
```

---

## 🔄 How to Migrate a Chart

### **Example: AdminEmissions.tsx**

#### **BEFORE (Recharts):**
```typescript
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={monthlyTrend}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Area 
      type="monotone" 
      dataKey="emissions" 
      stroke="#3b82f6" 
      fill="url(#colorEmissions)" 
    />
  </AreaChart>
</ResponsiveContainer>
```

#### **AFTER (Chart.js):**
```typescript
import { Line } from 'react-chartjs-2';
import { lineChartOptions, colors } from '../utils/chartConfig';

<div style={{ height: '300px' }}>
  <Line 
    data={{
      labels: monthlyTrend.map(d => d.month),
      datasets: [{
        label: 'Emissions',
        data: monthlyTrend.map(d => d.emissions),
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

## 📁 Complete File Structure

```
/src/app/
├── utils/
│   └── chartConfig.ts              ← Chart.js configuration
│
├── pages/
│   ├── ChartJSExample.tsx          ← Example page with all chart types
│   └── AdminEmissions.tsx          ← Currently uses Recharts (can migrate)
│
└── routes.ts                        ← Routing (includes /chartjs-examples)

/node_modules/
├── chart.js/                        ← Chart.js library
└── react-chartjs-2/                 ← React wrapper

/package.json                        ← Dependencies listed
```

---

## 🚀 Quick Start Steps

### **1. View Examples**
```
Navigate to: /chartjs-examples
```

### **2. Copy Configuration**
```typescript
import { lineChartOptions, colors } from '../utils/chartConfig';
```

### **3. Use in Your Page**
```typescript
import { Line } from 'react-chartjs-2';

<div style={{ height: '300px' }}>
  <Line data={myData} options={lineChartOptions} />
</div>
```

### **4. Customize (Optional)**
```typescript
import { colors } from '../utils/chartConfig';

// Use custom colors
backgroundColor: colors.chart.green,
borderColor: colors.chart.blue,
```

---

## 💡 What's Available

### **Chart Types:**
- ✅ Line Chart (`<Line />`)
- ✅ Bar Chart (`<Bar />`)
- ✅ Doughnut Chart (`<Doughnut />`)
- ✅ Pie Chart (`<Pie />`)
- ✅ Radar Chart (`<Radar />`)
- ✅ Polar Area Chart (`<PolarArea />`)

### **Pre-configured:**
- ✅ lineChartOptions
- ✅ barChartOptions
- ✅ areaChartOptions
- ✅ doughnutChartOptions

### **Brand Colors:**
- ✅ colors.chart.green (`#00bc7d`)
- ✅ colors.chart.blue (`#3b82f6`)
- ✅ colors.chart.purple (`#8b5cf6`)
- ✅ colors.chart.orange (`#f97316`)
- ✅ colors.chart.red (`#ef4444`)
- ✅ colors.chart.yellow (`#eab308`)

---

## 🔍 Finding Chart.js in Your Project

### **Search in VS Code:**
```
Ctrl/Cmd + Shift + F
Search: "chartConfig"
```

### **File Paths:**
```
/src/app/utils/chartConfig.ts
/src/app/pages/ChartJSExample.tsx
/src/app/routes.ts (line 104)
/package.json (dependencies)
```

---

## ✅ Verification Checklist

- ✅ Chart.js installed in package.json
- ✅ Configuration file created
- ✅ Example page created
- ✅ Added to routing
- ✅ Can access at /chartjs-examples
- ✅ All chart types working
- ✅ enwayu branding applied

---

## 📞 Next Steps

1. **Test the examples:** Navigate to `/chartjs-examples`
2. **Review the config:** Open `/src/app/utils/chartConfig.ts`
3. **Try in a page:** Add a chart to any existing page
4. **Optional:** Migrate AdminEmissions from Recharts to Chart.js

---

## 🎯 Summary

**Chart.js Location:**
```
📦 Package: /package.json (installed ✅)
⚙️ Config: /src/app/utils/chartConfig.ts ✅
📄 Examples: /src/app/pages/ChartJSExample.tsx ✅
🔗 Route: /chartjs-examples ✅
```

**Access Now:**
```
Navigate to: /chartjs-examples
```

---

**Status: Chart.js is fully integrated and ready to use!** ✅
