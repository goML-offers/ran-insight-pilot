# User Journey Testing Guide - RAN Co-pilot Dashboard

## Overview
This document outlines the testing steps for validating the complete user journey through the RAN Co-pilot Dashboard application.

## Prerequisites
- Application running on `http://localhost:5173`
- Backend API server running on configured URL (default: `http://localhost:8080`)
- Test data available in the backend

---

## Test Journey 1: Initial Dashboard Load

### Objective
Verify that the dashboard loads correctly with all KPIs and initial data.

### Steps
1. **Navigate to Application**
   - Open browser and go to `http://localhost:5173`
   - Expected: Application loads without errors

2. **Verify Header Components**
   - Check GoML logo is visible (top-left, approximately 32px height)
   - Verify KPI cards display in header:
     - Active Cells count
     - Average Throughput (Mbps)
     - Availability percentage
   - Expected: All KPIs show loading state, then populate with data

3. **Check View Selector**
   - Verify three view tabs are visible:
     - Analytics View (default)
     - Map View
     - Data Table View
   - Expected: Analytics View is selected by default

4. **Verify Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Expected: No critical errors (warnings acceptable)

---

## Test Journey 2: Analytics View Interaction

### Objective
Test all interactive elements and data visualization in the Analytics view.

### Steps
1. **Verify Charts Display**
   - Confirm the following charts are visible:
     - Network Performance (line chart)
     - Throughput Distribution (bar chart)
     - Cell Status Overview (area chart)
   - Expected: Charts render with data, axes labeled correctly

2. **Test Chart Interactions**
   - Hover over data points on each chart
   - Expected: Tooltips display with accurate values
   - Try clicking legend items to toggle data series
   - Expected: Data series show/hide correctly

3. **Check Time Range Controls** (if applicable)
   - Test any date/time filters
   - Expected: Charts update based on selected time range

4. **Verify Responsive Behavior**
   - Resize browser window (desktop → tablet → mobile)
   - Expected: Charts adapt and remain readable at all sizes

---

## Test Journey 3: Map View Exploration

### Objective
Validate the interactive map functionality and cell tower visualization.

### Steps
1. **Navigate to Map View**
   - Click "Map View" tab
   - Expected: Map loads showing cell tower locations

2. **Test Map Interactions**
   - Pan the map by clicking and dragging
   - Expected: Map moves smoothly
   - Zoom in/out using mouse wheel or controls
   - Expected: Map zoom level changes appropriately

3. **Verify Cell Tower Markers**
   - Check that cell tower markers are visible
   - Click on different cell tower markers
   - Expected: Popup/tooltip shows cell details (ID, status, performance metrics)

4. **Test Heatmap Layer** (if enabled)
   - Toggle heatmap visualization
   - Expected: Signal strength heatmap overlays on map
   - Verify color gradients represent signal strength correctly

5. **Check Map Controls**
   - Test zoom controls (+/-)
   - Test full-screen mode (if available)
   - Expected: All controls function correctly

---

## Test Journey 4: Data Table View

### Objective
Ensure data table displays comprehensive cell information with proper formatting.

### Steps
1. **Navigate to Data Table View**
   - Click "Data Table View" tab
   - Expected: Table loads with cell data

2. **Verify Table Structure**
   - Check column headers are present and descriptive:
     - Cell ID
     - Status
     - Throughput
     - Availability
     - Last Updated
   - Expected: All columns display with proper alignment

3. **Test Sorting**
   - Click on column headers to sort
   - Expected: Data sorts ascending/descending correctly
   - Try sorting multiple columns
   - Expected: Multi-column sort works as expected

4. **Test Filtering** (if available)
   - Use filter inputs or dropdowns
   - Expected: Table updates to show only matching rows

5. **Test Pagination** (if applicable)
   - Navigate between pages
   - Change items per page
   - Expected: Pagination controls work correctly

6. **Test Search** (if available)
   - Enter search terms in search box
   - Expected: Results filter in real-time

---

## Test Journey 5: AI Co-pilot Interaction

### Objective
Validate the AI-powered assistant functionality for network diagnostics.

### Steps
1. **Open Co-pilot Panel**
   - Look for Co-pilot button/icon (typically on right side)
   - Click to open Co-pilot panel
   - Expected: Chat interface opens smoothly

2. **Test Initial State**
   - Verify welcome message is displayed
   - Check suggested prompts/questions are shown (if applicable)
   - Expected: Clear indication that Co-pilot is ready

3. **Send Simple Query**
   - Type: "What is the current network status?"
   - Press Enter or click Send
   - Expected: 
     - Message appears in chat
     - Loading indicator shows
     - AI response appears within reasonable time

4. **Test Context-Aware Questions**
   - Ask: "Which cells are underperforming?"
   - Expected: AI analyzes current data and provides specific cell IDs
   - Ask follow-up: "What are the recommendations for cell [ID]?"
   - Expected: AI maintains conversation context

5. **Test Error Handling**
   - Send an unclear or invalid query
   - Expected: AI responds with clarification request or helpful message

6. **Test Chat History**
   - Scroll through previous messages
   - Expected: Chat history persists during session
   - Refresh page (if applicable)
   - Expected: Chat history behavior matches design (persist or clear)

7. **Close Co-pilot Panel**
   - Click close button or outside panel
   - Expected: Panel closes smoothly, main view remains intact

---

## Test Journey 6: Real-time Data Updates

### Objective
Verify that the dashboard updates with new data in real-time.

### Steps
1. **Monitor KPI Updates**
   - Note initial KPI values in header
   - Wait for configured refresh interval (typically 30-60 seconds)
   - Expected: KPIs update automatically without page refresh

2. **Check Chart Updates**
   - Observe charts in Analytics view
   - Expected: New data points appear as they arrive

3. **Verify Map Updates**
   - Watch for cell status changes on map
   - Expected: Marker colors/states update to reflect current status

4. **Table Data Refresh**
   - Monitor data table for updates
   - Expected: Table rows update with latest metrics

---

## Test Journey 7: Error Handling & Edge Cases

### Objective
Ensure graceful handling of errors and edge cases.

### Steps
1. **Test API Failure**
   - Stop backend API server
   - Expected: Error messages display clearly
   - Verify app doesn't crash
   - Restart backend
   - Expected: App recovers and loads data

2. **Test Slow Connection**
   - Throttle network in DevTools (Network tab → Throttling)
   - Expected: Loading states display appropriately
   - No timeout errors occur within reasonable timeframe

3. **Test Empty Data States**
   - Modify backend to return no data
   - Expected: Empty state messages display instead of broken UI

4. **Test Invalid Data**
   - Send malformed data from backend
   - Expected: App handles gracefully with error boundaries

---

## Test Journey 8: Cross-Browser Compatibility

### Objective
Validate application works across different browsers.

### Browsers to Test
- Chrome/Edge (Chromium-based)
- Firefox
- Safari (macOS/iOS)

### Steps (Repeat for Each Browser)
1. **Basic Functionality**
   - Load application
   - Navigate between all views
   - Test Co-pilot chat
   - Expected: All features work consistently

2. **Visual Consistency**
   - Compare UI appearance across browsers
   - Check for layout issues
   - Expected: Design looks consistent (minor differences acceptable)

3. **Performance**
   - Monitor load times
   - Test animation smoothness
   - Expected: Acceptable performance in all browsers

---

## Test Journey 9: Mobile Responsive Testing

### Objective
Ensure mobile experience is fully functional.

### Devices to Test
- Mobile phone (375px width)
- Tablet (768px width)
- Desktop (1920px width)

### Steps
1. **Layout Adaptation**
   - Test at each viewport size
   - Expected: UI adapts without horizontal scrolling

2. **Touch Interactions**
   - Tap buttons and links
   - Swipe/pan map view
   - Expected: All interactions work with touch

3. **Mobile Navigation**
   - Verify navigation is accessible
   - Test Co-pilot panel on mobile
   - Expected: No UI elements are unreachable

4. **Performance on Mobile**
   - Test on actual mobile device if possible
   - Expected: Reasonable performance, no crashes

---

## Test Journey 10: Accessibility Testing

### Objective
Verify application is accessible to users with disabilities.

### Steps
1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Expected: Focus indicators visible, logical tab order
   - Test Escape key to close modals/panels
   - Expected: Works consistently

2. **Screen Reader Testing**
   - Use screen reader (NVDA/JAWS/VoiceOver)
   - Navigate through dashboard
   - Expected: All content is announced clearly

3. **Color Contrast**
   - Use browser extension (e.g., WAVE, axe DevTools)
   - Check contrast ratios
   - Expected: Meets WCAG 2.1 AA standards

4. **Alt Text**
   - Verify images have descriptive alt attributes
   - Check logo alt text
   - Expected: All images have meaningful alt text

---

## Test Journey 11: Performance Testing

### Objective
Validate application performance under various conditions.

### Steps
1. **Initial Load Performance**
   - Open DevTools → Lighthouse
   - Run performance audit
   - Expected: Score >70 (ideally >90)

2. **Memory Leaks**
   - Open DevTools → Memory
   - Take heap snapshot
   - Navigate through all views
   - Take another snapshot
   - Expected: No significant memory growth

3. **Network Optimization**
   - Check Network tab in DevTools
   - Verify resources are cached appropriately
   - Expected: Subsequent loads are faster

---

## Test Journey 12: Session Persistence

### Objective
Test data persistence across sessions.

### Steps
1. **View Selection Persistence** (if implemented)
   - Switch to Map View
   - Refresh page
   - Expected: Returns to Map View (or default based on design)

2. **Co-pilot History** (if implemented)
   - Have a conversation with Co-pilot
   - Refresh page
   - Expected: Chat history persists or clears based on design

---

## Automated Testing Checklist

### Unit Tests
- [ ] Component rendering tests
- [ ] Utility function tests
- [ ] API service tests

### Integration Tests
- [ ] View switching functionality
- [ ] Co-pilot message flow
- [ ] Data fetching and display

### E2E Tests (if applicable)
- [ ] Complete user journeys automated
- [ ] Critical paths covered

---

## Bug Reporting Template

When issues are found during testing, use this template:

```
**Title**: [Brief description]

**Journey/Test**: [Which test journey]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Browser/Device**: 

**Screenshots**: [If applicable]

**Console Errors**: [If any]

**Severity**: Critical / High / Medium / Low
```

---

## Success Criteria

All test journeys should pass with:
- ✅ No critical errors in console
- ✅ All features functional
- ✅ Responsive design works on all tested devices
- ✅ Acceptable performance metrics
- ✅ Graceful error handling
- ✅ Accessible to keyboard and screen reader users

---

## Notes

- Test regularly during development, not just before release
- Update this document as new features are added
- Consider automating critical paths with E2E tests
- Perform regression testing after bug fixes

---

**Last Updated**: 2025-10-20
**Version**: 1.0
