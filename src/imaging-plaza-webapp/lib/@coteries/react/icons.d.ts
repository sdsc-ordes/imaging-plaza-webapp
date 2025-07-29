/// <reference types="react" />
import React, {PropsWithChildren} from 'react'
import {TypeHolder} from '@coteries/utils'

// Icon name type - includes both your custom icons and common icon names
export type IconName = 
  | 'plus'
  | 'circle-check' 
  | 'pen'
  | 'close'
  | 'times'
  | 'arrow-right'
  | 'trash'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevrons-right'
  | 'search'
  | 'user'
  | 'settings'
  | 'home'
  | 'menu'
  | 'x'
  | string // Allow any string for extensibility

// Icon props interface
export interface IconProps {
  size?: number | string
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}

// UnsafeIcon component
export declare const UnsafeIcon: ({
  i,
  col,
  ...props
}: {
  i: IconName
  col?: string
} & IconProps) => JSX.Element

// Icon collections type (for compatibility with FontAwesome structure)
export type IconCollections = Record<string, any>

// Icon registry type
export type IconRegistry = Record<string, React.ComponentType<IconProps> | React.FC<IconProps>>

// createIconContext function
export declare const createIconContext: <
  C extends IconCollections,
  I extends IconRegistry
>(
  collections: C,
  icons: I,
  defaultCollection?: keyof C | undefined
) => [
  (p: PropsWithChildren) => JSX.Element,
  React.ComponentType<{
    i: keyof I | IconName
  } & IconProps>,
  TypeHolder<I>
]

// Custom icon type
export type CustomIcon = React.ReactElement | IconName

// CustomIcon component
export declare const CustomIcon: ({i}: {i: CustomIcon}) => JSX.Element

// Icon map export for extensibility
export declare const iconMap: IconRegistry
