# 🔧 3D Models Not Showing - Troubleshooting Guide

## 🚨 **Issue**: 3D models are not displaying in the Quest Map

## 🔍 **Diagnostic Steps**

### **Step 1: Test Basic 3D Rendering**
Navigate to: `http://localhost:5173/3d-test`

**What you should see:**
- Pink cube (left)
- Orange cylinder (center) 
- Blue sphere (right)
- Ability to rotate camera with mouse

**If you DON'T see these objects:**
- Your browser doesn't support WebGL
- Three.js isn't loading properly
- There's a JavaScript error

### **Step 2: Test Simple Quest Map**
Navigate to: `http://localhost:5173/quest-map-simple`

**What you should see:**
- 5 colored cube stages in a line
- 4 floating team spheres above stages
- Stars in background
- Ability to click objects

### **Step 3: Check Browser Console**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Common errors and solutions below

---

## 🛠️ **Common Issues & Solutions**

### **Issue 1: WebGL Not Supported**
**Error**: "WebGL not supported" or black screen

**Solution**:
- Update your graphics drivers
- Try a different browser (Chrome, Firefox, Edge)
- Enable hardware acceleration in browser settings
- Check if WebGL is enabled: visit `chrome://gpu/` or `about:support`

### **Issue 2: Import Errors**
**Error**: "Cannot resolve module" or "Module not found"

**Solution**:
```bash
# Reinstall dependencies
npm install

# Or if that doesn't work:
rm -rf node_modules package-lock.json
npm install
```

### **Issue 3: TypeScript Errors**
**Error**: Type errors in console

**Solution**:
```bash
# Clear TypeScript cache
npx tsc --build --clean
npm run dev
```

### **Issue 4: Canvas Not Rendering**
**Error**: Blank screen where 3D should be

**Solution**:
- Check if Canvas has proper dimensions
- Ensure camera position is correct
- Verify lighting is present

### **Issue 5: Performance Issues**
**Error**: 3D renders but is very slow/choppy

**Solution**:
- Reduce particle count in components
- Disable complex shaders temporarily
- Check if integrated graphics is being used instead of dedicated GPU

---

## 🔧 **Quick Fixes**

### **Fix 1: Update Vite Config**
If models still don't load, update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
```

### **Fix 2: Add Error Boundaries**
Wrap 3D components in error boundaries to catch issues:

```tsx
import React from 'react';

class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Rendering Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">3D Rendering Error</h2>
            <p>Your browser may not support WebGL or there's a rendering issue.</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### **Fix 3: Fallback 2D Version**
If 3D continues to fail, we can create a 2D SVG version:

```tsx
const Fallback2DQuestMap = () => (
  <div className="w-full h-screen bg-gradient-to-b from-purple-900 to-blue-900 flex items-center justify-center">
    <svg width="800" height="400" viewBox="0 0 800 400">
      {/* 2D representation of the quest map */}
      <circle cx="100" cy="200" r="30" fill="#8b5cf6" />
      <text x="100" y="250" textAnchor="middle" fill="white">Registration</text>
      
      <circle cx="250" cy="200" r="30" fill="#10b981" />
      <text x="250" y="250" textAnchor="middle" fill="white">Ideation</text>
      
      {/* Continue for other stages... */}
    </svg>
  </div>
);
```

---

## 🎯 **Testing Checklist**

- [ ] Browser supports WebGL
- [ ] No JavaScript errors in console
- [ ] Dependencies installed correctly
- [ ] Basic 3D test works (`/3d-test`)
- [ ] Simple quest map works (`/quest-map-simple`)
- [ ] Camera controls respond to mouse
- [ ] Objects are clickable

---

## 🚀 **Available Routes for Testing**

1. **`/3d-test`** - Basic 3D shapes test
2. **`/quest-map-simple`** - Simplified quest map
3. **`/quest-map-basic`** - Original quest map
4. **`/quest-map`** - Enhanced quest map (most complex)

**Recommendation**: Test in this order to isolate issues.

---

## 📞 **Still Having Issues?**

If 3D models still aren't showing:

1. **Check Browser Compatibility**:
   - Chrome 90+ ✅
   - Firefox 88+ ✅
   - Safari 14+ ✅
   - Edge 90+ ✅

2. **System Requirements**:
   - WebGL 2.0 support
   - Hardware acceleration enabled
   - Updated graphics drivers

3. **Network Issues**:
   - Check if running on localhost
   - Ensure dev server is running (`npm run dev`)
   - Try hard refresh (Ctrl+F5)

4. **Last Resort**:
   - Try incognito/private browsing mode
   - Disable browser extensions
   - Try a different device/computer

---

## 🎮 **Expected Behavior When Working**

When everything is working correctly, you should see:
- Smooth 3D animations
- Interactive camera controls
- Clickable 3D objects
- Floating text labels
- Particle effects
- Glowing materials
- Responsive hover effects

The quest map should feel like a living, breathing 3D world where teams move through their hackathon journey!
