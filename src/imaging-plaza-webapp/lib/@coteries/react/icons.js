'use strict'

var React = require('react')
var utils = require('@coteries/utils')

// Import Lucide React for icons
var lucide = require('lucide-react')

// Dynamic imports for SVG icons
let svgIcons = {}

// Try to dynamically import SVG icons
try {
  svgIcons = {
    // Solid icons
    'plus': require('../../../components/Icons/solid/Plus.svg').default || require('../../../components/Icons/solid/Plus.svg'),
    'circle-check': require('../../../components/Icons/solid/CircleCheck.svg').default || require('../../../components/Icons/solid/CircleCheck.svg'),
    'pen': require('../../../components/Icons/solid/Pen.svg').default || require('../../../components/Icons/solid/Pen.svg'),
    'times': require('../../../components/Icons/solid/Times.svg').default || require('../../../components/Icons/solid/Times.svg'),
    'arrow-right': require('../../../components/Icons/solid/ArrowRight.svg').default || require('../../../components/Icons/solid/ArrowRight.svg'),
    
    // Light icons  
    'chevron-right': require('../../../components/Icons/light/ChevronRight.svg').default || require('../../../components/Icons/light/ChevronRight.svg'),
    'trash': require('../../../components/Icons/light/Trash.svg').default || require('../../../components/Icons/light/Trash.svg'),
    
    // Regular icons
    'chevron-down': require('../../../components/Icons/regular/ChevronDown.svg').default || require('../../../components/Icons/regular/ChevronDown.svg'),
    'chevron-up': require('../../../components/Icons/regular/ChevronUp.svg').default || require('../../../components/Icons/regular/ChevronUp.svg'),
  }
} catch (e) {
  console.warn('Some SVG icons could not be loaded:', e.message)
  svgIcons = {}
}

// Map FontAwesome icon names to SVG components or Lucide icons
const iconMap = {
  // SVG icons from your collection
  ...svgIcons,
  
  // Use Times icon for close as well
  'close': svgIcons['times'],
  
  // Lucide fallbacks for icons not in your SVG collection
  'chevron-left': lucide.ChevronLeft,
  'chevrons-right': lucide.ChevronsRight,
  'search': lucide.Search,
  'user': lucide.User,
  'settings': lucide.Settings,
  'home': lucide.Home,
  'menu': lucide.Menu,
  'x': lucide.X,
}

// Create context for icon system
const ctx = React.createContext({collections: {}, icons: {}})

// UnsafeIcon component - maintains same API as FontAwesome version
const UnsafeIcon = ({i, col, ...props}) => {
  const IconComponent = iconMap[i]
  
  if (!IconComponent) {
    console.warn(`Icon "${i}" not found in icon map`)
    return React.createElement('span', {style: {display: 'inline-block', width: '16px', height: '16px'}}, '?')
  }
  
  // If it's a Lucide icon (function), render it directly
  if (typeof IconComponent === 'function') {
    return React.createElement(IconComponent, {
      size: props.width || props.size || 16,
      ...props
    })
  }
  
  // If it's an SVG component, render it
  return React.createElement(IconComponent, {
    width: props.width || '16',
    height: props.height || '16',
    ...props
  })
}

// createIconContext function - maintains same API
const createIconContext = (collections, icons, defaultCollection) => {
  // Merge provided icons with our icon map
  const allIcons = {...iconMap, ...icons}
  
  const Provider = ({children}) =>
    React.createElement(
      ctx.Provider,
      {value: {collections, icons: allIcons, defaultCollection: defaultCollection}},
      children
    )
    
  const Icon = ({i, ...props}) => {
    const contextIcons = React.useContext(ctx).icons
    const IconComponent = contextIcons[i] || iconMap[i]
    
    if (!IconComponent) {
      console.warn(`Icon "${i}" not found`)
      return React.createElement('span', {style: {display: 'inline-block', width: '16px', height: '16px'}}, '?')
    }
    
    // If it's a Lucide icon (function), render it directly
    if (typeof IconComponent === 'function') {
      return React.createElement(IconComponent, {
        size: props.width || props.size || 16,
        ...props
      })
    }
    
    // If it's an SVG component, render it
    return React.createElement(IconComponent, {
      width: props.width || '16',
      height: props.height || '16',
      ...props
    })
  }
  
  return [Provider, Icon, new utils.TypeHolder()]
}

// CustomIcon component - maintains same API
const CustomIcon = ({i}) => {
  return typeof i === 'string' ? React.createElement(UnsafeIcon, {i: i}) : i
}

module.exports = {
  UnsafeIcon,
  createIconContext,
  CustomIcon,
  iconMap
}
