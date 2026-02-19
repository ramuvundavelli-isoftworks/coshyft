# 🚗 Log Commute Modal - Complete Feature Documentation

## 📋 Overview

A comprehensive, audit-grade modal for logging employee commute data that supports Scope 3 Category 7 – Employee Commuting compliance (CSRD/ESRS E1).

## 🎯 Key Features

### ✅ **Multi-Step Wizard Flow**
- **Step 1: Mode Selection** - Choose from 13 transport modes
- **Step 2: Details** - Date, office location
- **Step 3: Distance** - Manual OR auto-calculate
- **Step 4: Carpool** (conditional) - Passenger count, role
- **Step 5: Preview** - Review & submit with transparency

### ✅ **13 Transport Modes** (3 Categories)

#### 🟢 Zero Emissions (0 kg CO₂)
- Work from Home
- Walking  
- Cycling

#### 🔵 Low Emissions (0.005-0.053 kg/km)
- E-Bike
- DART (Electric rail)
- Luas (Light rail)
- Electric Car

#### 🟠 Medium Emissions (0.084-0.168 kg/km)
- Carpool (Shared)
- Petrol Car (Solo)
- Motorcycle

### ✅ **Smart Distance Input**
- **Manual Entry**: Direct km input
- **Auto-Calculate**: Map-based route calculation (placeholder for Google Maps API)
- Real-time validation

### ✅ **Carpool Intelligence**
- Passenger count tracking
- Driver vs. Passenger role
- License plate (optional)
- **Saved emissions calculation**
- Example: 4 people carpooling = 75% reduction per person

### ✅ **Data Transparency**
- Collapsible calculation details
- Shows formula: `Distance × Factor ÷ Passengers`
- Emission factor source (e.g., SEAI 2024)
- Factor version & last updated date
- Builds trust for audit compliance

### ✅ **Validation & Edge Cases**

#### Duplicate Detection
```
"You already logged a commute for 2026-02-18. This will replace it."
```

#### Future Date Prevention
```
"Date cannot be in the future."
```

#### Unusual Distance Warning
```
"Distance is 3.2× your usual average. Please verify."
```

#### Zero Distance
```
"Distance must be greater than zero."
```

### ✅ **Scope 3 Compliance Messaging**
Every submission shows:
```
📘 Scope 3 Category 7 – Employee Commuting
This data contributes to your organization's CSRD/ESRS E1 
compliance reporting and will be included in the annual 
sustainability audit.
```

## 🏗️ Technical Architecture

### Component Interface
```typescript
interface LogCommuteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (commuteData: CommuteEntry) => void;
  existingEntries?: CommuteEntry[]; // For duplicate detection
}

interface CommuteEntry {
  id?: string;
  date: string;
  officeLocation: string;
  mode: string;
  distance: number;
  emissions: number;
  dataType: 'primary' | 'manual' | 'estimated';
  carpoolDetails?: {
    passengers: number;
    role: 'driver' | 'passenger';
    licensePlate?: string;
  };
  route?: {
    start: string;
    end: string;
  };
  factor: {
    value: number;
    source: string;
    version: string;
    lastUpdated: string;
  };
  savedEmissions?: number;
  createdAt?: string;
}
```

### Emission Calculation Logic

#### Zero Emissions (Remote/Walk/Cycle)
```typescript
emissions = 0 kg
```

#### Standard Modes
```typescript
emissions = distance × factor
// Example: 12.5 km × 0.168 kg/km = 2.1 kg CO₂
```

#### Carpool (Shared Emissions)
```typescript
soloEmissions = distance × factor
sharedEmissions = soloEmissions ÷ totalPeople
savedEmissions = soloEmissions - sharedEmissions

// Example: 
// Solo: 12.5 km × 0.168 = 2.1 kg
// Carpool (4 people): 2.1 ÷ 4 = 0.525 kg
// Saved: 2.1 - 0.525 = 1.575 kg
```

## 🎨 UX Design Principles

### Progressive Disclosure
- Only show relevant steps based on mode
- Remote work → Skip directly to preview
- Carpool → Show additional carpool step
- Walking/Cycling → Simple flow

### Visual Hierarchy
- **Color-coded categories**: Green (zero), Blue (low), Orange (medium)
- **Icon-based selection**: Instantly recognizable transport modes
- **Large touch targets**: 3-column grid layout

### Trust Building
- Show emission factor sources
- Display calculation formula
- Compliance messaging throughout
- Data type badges (Primary/Manual/Estimated)

### Error Prevention
- Disable submit until valid
- Inline validation messages
- Warnings (not blocking) for unusual data
- Confirmation modals for duplicates

## 📊 Data Quality Tracking

### Data Type Classification
- **Primary**: GPS-tracked or auto-calculated via maps
- **Manual**: Employee self-reported distance
- **Estimated**: System-generated based on patterns

## 🔄 User Flow Examples

### Example 1: Remote Work (Fastest)
```
1. Click "Log Commute"
2. Select "Work from Home"
3. ✅ Done (auto-submits with 0 emissions)
```

### Example 2: Cycling (Simple)
```
1. Click "Log Commute"
2. Select "Cycling"
3. Enter date + office location
4. Confirm preview (0 emissions)
5. ✅ Submit
```

### Example 3: Carpool (Full Flow)
```
1. Click "Log Commute"
2. Select "Carpool (Shared)"
3. Enter date + office location
4. Choose distance method (Manual)
5. Enter 12.5 km
6. Enter passenger count: 3
7. Select role: Driver
8. Review preview: 0.525 kg (saved 1.575 kg!)
9. ✅ Submit
```

### Example 4: Electric Car with Map
```
1. Click "Log Commute"
2. Select "Electric Car"
3. Enter date + office location
4. Choose distance method (Auto-Calculate)
5. Enter start address: "123 Main St, Dublin"
6. Enter end address: "Tech Park, Dublin 18"
7. Click "Calculate Route Distance" → 12.5 km
8. Review preview: 0.66 kg
9. View calculation details (expandable)
10. ✅ Submit
```

## 🚨 Edge Case Handling

### Case 1: 3 Consecutive Unlogged Days
*Implementation needed in dashboard*
```
Banner: "You have 3 unlogged commute days."
CTA: "Log Now"
```

### Case 2: Very High Distance
```
Warning: "Distance is 3.2× your usual average. Please verify."
Still allows submission (soft warning)
```

### Case 3: Duplicate Entry
```
Warning: "You already logged a commute for 2026-02-18. 
This will replace it."
Allows override with confirmation
```

### Case 4: Future Date Selected
```
Error: "Date cannot be in the future."
Blocks submission (hard validation)
```

## 🔌 Integration Points

### Backend Requirements
```typescript
// POST /api/commutes
{
  "date": "2026-02-18",
  "userId": "user123",
  "officeLocation": "HQ - Tech Park Dublin",
  "mode": "Carpool (Shared)",
  "distance": 12.5,
  "emissions": 0.525,
  "dataType": "manual",
  "savedEmissions": 1.575,
  "carpoolDetails": {
    "passengers": 3,
    "role": "driver",
    "licensePlate": "241-D-12345"
  },
  "factor": {
    "value": 0.168,
    "source": "SEAI 2024",
    "version": "2.1",
    "lastUpdated": "2024-06-15"
  }
}
```

### Analytics Events
```typescript
// Track modal usage
analytics.track('log_commute_modal_opened');
analytics.track('log_commute_mode_selected', { mode: 'carpool' });
analytics.track('log_commute_submitted', { 
  mode: 'carpool', 
  emissions: 0.525,
  saved: 1.575 
});
```

## 📱 Responsive Design

- **Desktop**: 3-column grid for mode cards
- **Tablet**: 2-column grid
- **Mobile**: 1-column stack
- Modal max-height: 90vh with scroll

## ♿ Accessibility

- ✅ Keyboard navigation
- ✅ Focus management
- ✅ ARIA labels
- ✅ Color contrast (WCAG AA)
- ✅ Tooltips for context

## 🧪 Testing Checklist

### Functional Tests
- [ ] Zero emission modes submit instantly
- [ ] Distance validation works
- [ ] Carpool calculation correct
- [ ] Duplicate detection works
- [ ] Future date blocked
- [ ] Unusual distance shows warning
- [ ] Modal closes on submit
- [ ] Modal closes on cancel
- [ ] Back navigation works
- [ ] Progress indicator updates

### Visual Tests
- [ ] Icons display correctly
- [ ] Colors match design system
- [ ] Hover states work
- [ ] Tooltips appear
- [ ] Modal centers on screen
- [ ] Scrolling works on overflow
- [ ] Mobile responsive

### Integration Tests
- [ ] onSubmit callback fires
- [ ] Correct data structure sent
- [ ] Existing entries passed correctly
- [ ] Date picker limits work
- [ ] Office dropdown populates

## 🎯 Future Enhancements

1. **Google Maps Integration**
   - Real route calculation
   - Traffic-aware distance
   - Route preview map

2. **Pattern Recognition**
   - Auto-suggest based on history
   - "Same as yesterday" quick action
   - Weekly patterns

3. **Gamification**
   - Streak tracking visual
   - Badge unlock on submission
   - Leaderboard integration

4. **Bulk Import**
   - CSV upload for past commutes
   - Calendar integration
   - Auto-sync with HR systems

5. **Offline Support**
   - Save draft locally
   - Submit when online
   - Conflict resolution

## 📦 Files Created

1. `/src/app/components/LogCommuteModal.tsx` - Main modal component (900+ lines)
2. `/src/app/pages/LogCommuteDemo.tsx` - Demo/testing page
3. `/src/app/routes.ts` - Added `/demo/log-commute` route

## 🚀 Usage Example

```tsx
import { LogCommuteModal, CommuteEntry } from '../components/LogCommuteModal';

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<CommuteEntry[]>([]);

  const handleSubmit = (entry: CommuteEntry) => {
    setEntries(prev => [...prev, entry]);
    // Save to backend
    fetch('/api/commutes', {
      method: 'POST',
      body: JSON.stringify(entry)
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Log Commute
      </Button>
      
      <LogCommuteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        existingEntries={entries}
      />
    </>
  );
}
```

## 🎓 Demo

Visit `/demo/log-commute` to see the full feature in action!

---

**Built with enterprise-grade standards for Scope 3 Category 7 compliance** ✨
