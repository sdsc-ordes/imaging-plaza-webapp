'use strict'

var react = require('@chakra-ui/react')
var React = require('react')
var utils = require('@coteries/utils')
var icons = require('./icons')
var zod = require('@hookform/resolvers/zod')
var reactHookForm = require('react-hook-form')
var framerMotion = require('framer-motion')

const ctx = React.createContext({collections: {}, icons: {}})
const UnsafeIcon = icons.UnsafeIcon
const createIconContext = icons.createIconContext
const CustomIcon = icons.CustomIcon

const EditableText = ({
  text,
  onChange,
  addAText,
  type = 'input',
  as,
  plusIcon = 'plus',
  changeIcon = 'circle-check',
  editIcon = 'pen',
  isDisabled = false,
}) => {
  const [isEditing, setEditing] = react.useBoolean()
  const ref = React.useRef(null)
  const onSubmit = () => {
    onChange(ref.current?.value ?? '')
    setEditing.off()
  }
  React.useEffect(() => {
    function handleKeyDown(e) {
      if (isEditing && document.activeElement === ref.current) {
        if (e.key === 'Escape') {
          setEditing.off()
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isEditing) {
          onSubmit()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })
  const InputComponent = type === 'input' ? react.Input : react.Textarea
  if (isEditing)
    return React.createElement(
      'form',
      {style: {width: '100%', position: 'relative'}, onSubmit: onSubmit},
      React.createElement(InputComponent, {
        minH: 'unset',
        as: as,
        ref: ref,
        defaultValue: text ?? '',
      }),
      React.createElement(react.IconButton, {
        'aria-label': 'submit',
        zIndex: '2',
        type: 'submit',
        size: 'sm',
        bottom: '2',
        right: '2',
        variant: 'link',
        colorScheme: 'blue',
        transition: 'all .3s ease',
        isDisabled: isDisabled,
        _hover: {
          transform: 'scale(1.2)',
        },
        icon: React.createElement(CustomIcon, {i: changeIcon}),
        position: 'absolute',
      })
    )
  if (!text) {
    return React.createElement(
      react.Button,
      {
        variant: 'link',
        leftIcon: React.createElement(CustomIcon, {i: plusIcon}),
        colorScheme: 'blue',
        isDisabled: isDisabled,
        onClick: setEditing.on,
      },
      addAText
    )
  }
  return React.createElement(
    react.Text,
    null,
    text,
    ' ',
    React.createElement(react.IconButton, {
      color: 'blue.500',
      mt: '-3',
      h: '4',
      variant: 'unstyled',
      'aria-label': 'edit',
      display: 'inline-block',
      isDisabled: isDisabled,
      onClick: () => {
        setEditing.toggle()
        setTimeout(() => {
          if (ref.current) {
            ref.current.focus()
            ref.current.setSelectionRange(text?.length ?? 0, text?.length ?? 0)
          }
        })
      },
      icon: React.createElement(CustomIcon, {i: editIcon}),
    })
  )
}

const FormControlWithError = ({
  label,
  error,
  children,
  leftElement,
  rightElement,
  below,
  chakraStyle,
  isRequired,
}) => {
  const controlProps = {...chakraStyle?.formControl}
  const labelProps = {...chakraStyle?.formLabel}
  const errorProps = {...chakraStyle?.formErrorMessage}
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      react.FormControl,
      {isInvalid: !!error, pb: below ? 3 : 0, isRequired: isRequired, ...controlProps},
      label && React.createElement(react.FormLabel, {...labelProps}, label),
      React.createElement(react.InputGroup, null, leftElement, children, rightElement),
      React.createElement(react.FormErrorMessage, {...errorProps}, error?.message),
      below
    )
  )
}
const LabelInFront = {
  formControl: {
    display: 'flex',
  },
  formLabel: {
    m: 0,
    mt: 2,
    mr: 2,
    flex: '1 0 fit-content',
  },
}

const zInput = ({ztype, ...props}) => {
  if (utils.isZodNumber(ztype)) {
    return React.createElement(
      react.NumberInput,
      {w: '100%'},
      React.createElement(react.NumberInputField, {...props}),
      React.createElement(
        react.NumberInputStepper,
        null,
        React.createElement(react.NumberIncrementStepper, null),
        React.createElement(react.NumberDecrementStepper, null)
      )
    )
  }
  return React.createElement(react.Input, {...props})
}
const leftAddOn = (icon, addon) => {
  if (icon) return React.createElement(react.InputLeftElement, null, icon)
  if (addon) return React.createElement(react.InputLeftAddon, null, addon)
  return null
}
const rightAddOn = (icon, addon) => {
  if (icon) return React.createElement(react.InputRightElement, null, icon)
  if (addon) return React.createElement(react.InputRightAddon, null, addon)
  return null
}
const TypedField = ({
  name,
  ztype,
  error,
  register,
  descriptor,
  label,
  placeholder,
  hideRequiredSign,
}) => {
  const Wrapper = ({children}) =>
    React.createElement(
      FormControlWithError,
      {
        chakraStyle: descriptor?.chakraStyle,
        error: error,
        isRequired: !hideRequiredSign && !ztype.isOptional(),
        label: label,
        leftElement: leftAddOn(descriptor?.leftIcon, descriptor?.leftAddon),
        rightElement: rightAddOn(descriptor?.rightIcon, descriptor?.rightAddon),
      },
      children
    )
  if (descriptor?.type === 'select') {
    return React.createElement(
      Wrapper,
      null,
      React.createElement(
        react.Select,
        {...register},
        descriptor.options.map(o =>
          React.createElement('option', {key: o.value, value: o.value}, o.label)
        )
      )
    )
  }
  if (descriptor?.type === 'bigtext') {
    return React.createElement(
      Wrapper,
      null,
      React.createElement(react.Textarea, {...register, placeholder: placeholder})
    )
  } else
    return React.createElement(
      Wrapper,
      null,
      zInput({
        ztype,
        type: descriptor?.type,
        placeholder,
        ...register,
      })
    )
}

const CompSuffix = 'Comp'
const AutoForm = ({model, defaultValues, onSubmit, descriptor, formRef, debug, ...props}) => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: {errors, isValid},
  } = reactHookForm.useForm({resolver: zod.zodResolver(model), defaultValues})
  const [submitting, setSubmitting] = React.useState(false)
  const flattened = React.useMemo(() => utils.flattenZodSchema(model), [model])
  const [components] = React.useState(props)

  React.useImperativeHandle(
    formRef,
    () => {
      return {
        setError,
        watch,
      }
    },
    []
  )
  const submitWrapper = async d => {
    setSubmitting(true)
    try {
      await onSubmit(d)
    } catch (e) {
      console.error('error while submitting: ', e)
    } finally {
      setSubmitting(false)
    }
  }
  const vstackProps = descriptor?.sections
    ? {
        divider: React.createElement(react.StackDivider, {borderColor: 'gray.200'}),
        spacing: 4,
        align: 'stretch',
      }
    : {}
  const Field = React.useMemo(
    () =>
      function Field({name, error}) {
        if (descriptor?.custom?.[name]) {
          const Element = components[`${name}${CompSuffix}`]
          return Element
        } else {
          let options = descriptor?.fields?.[name]?.registerOptions ?? {}
          const ztype = flattened[name]
          if (utils.isZodNumber(ztype)) {
            options.valueAsNumber = true
          } else if (utils.isZodDate(ztype)) {
            options.valueAsDate = true
          }
          const tlKey = utils.camelCaseDots(name)
          return React.createElement(TypedField, {
            name: name,
            ztype: ztype,
            descriptor: descriptor?.fields?.[name],
            label: descriptor?.labelForField?.(tlKey),
            placeholder: descriptor?.placeholderForField?.(tlKey),
            hideRequiredSign: descriptor?.hideRequiredSign,
            error: error,
            register: register(name, options),
          })
        }
      },
    []
  )
  return React.createElement(
    'form',
    {onSubmit: handleSubmit(submitWrapper)},
    React.createElement(
      react.VStack,
      {spacing: descriptor?.spacing ?? 4, align: 'stretch', ...vstackProps},
      descriptor?.sections
        ? Object.entries(descriptor.sections).map(([s, section]) =>
            React.createElement(
              react.VStack,
              {align: 'stretch', key: s},
              section.title && React.createElement(react.Heading, {size: 'sm'}, section.title),
              section.fields.map(f =>
                React.createElement(Field, {key: f, name: f, error: errors[f]})
              )
            )
          )
        : React.createElement(
            React.Fragment,
            null,
            Object.keys(flattened).map(name =>
              React.createElement(Field, {key: name, name: name, error: errors[name]})
            ),
            Object.keys(descriptor?.custom ?? {}).map(name =>
              React.createElement(Field, {key: name, name: name, error: errors[name]})
            )
          )
    ),
    React.createElement(
      react.HStack,
      {mt: '5'},
      debug && React.createElement(react.Text, null, errors && JSON.stringify(errors)),
      React.createElement(
        react.Button,
        {colorScheme: 'blue', type: 'submit', isLoading: submitting, ...descriptor?.submitProps},
        descriptor?.submitText ?? 'Save'
      ),
      descriptor?.cancel &&
        React.createElement(
          react.Button,
          {isDisabled: submitting, onClick: () => descriptor.cancel?.onCancel()},
          descriptor.cancel?.text
        )
    )
  )
}

const rules = [
  [
    {
      colSpan: 5,
      rowSpan: 2,
    },
  ],
  [
    {
      colSpan: 3,
      rowSpan: 2,
    },
    {colSpan: 2, rowSpan: 1},
    {colSpan: 2, rowSpan: 1},
  ],
  [
    {
      colSpan: 3,
      rowSpan: 2,
    },
    {colSpan: 1, rowSpan: 1},
    {colSpan: 1, rowSpan: 1},
    {colSpan: 2, rowSpan: 1},
  ],
  [
    {
      colSpan: 3,
      rowSpan: 2,
    },
    {colSpan: 1, rowSpan: 1},
    {colSpan: 1, rowSpan: 1},
    {colSpan: 1, rowSpan: 1},
    {colSpan: 1, rowSpan: 1},
  ],
]
const PictureGallery = ({pictures, seePhotosText}) => {
  const count = pictures.length
  const grid = rules[pictures.length > rules.length ? rules.length - 1 : pictures.length - 1]
  const [displayModal, setDisplayModal] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  if (pictures.length === 0) return null
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      react.Grid,
      {
        h: '312px',
        overflow: 'hidden',
        templateRows: 'repeat(2, 1fr)',
        templateColumns: 'repeat(5, 1fr)',
        role: 'grid',
        gap: 4,
      },
      pictures.slice(0, count == 1 ? 1 : grid.length - 1).map((p, i) =>
        React.createElement(react.GridItem, {
          key: p,
          role: 'gridcell',
          ...grid[i],
          h: '100%',
          w: '100%',
          overflow: 'hidden',
          backgroundImage: `url(${p})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '10px',
        })
      ),
      count > 1 &&
        React.createElement(
          react.GridItem,
          {...grid[grid.length - 1], role: 'gridcell'},
          React.createElement(
            react.Button,
            {
              w: '100%',
              h: '100%',
              onClick: () => setDisplayModal(true),
              variant: 'outline',
              borderRadius: '10px',
              bg: 'blue.50',
              borderColor: 'blue.500',
              color: 'blue.500',
            },
            React.createElement(
              react.VStack,
              null,
              React.createElement(UnsafeIcon, {i: 'arrow-right'}),
              React.createElement(react.Text, {color: 'blue.500'}, seePhotosText)
            )
          )
        )
    ),
    React.createElement(
      react.Modal,
      {isOpen: displayModal, onClose: () => setDisplayModal(false), size: 'full'},
      React.createElement(react.ModalOverlay, {bg: 'blackAlpha.700', backdropFilter: 'blur(3px)'}),
      React.createElement(
        react.ModalContent,
        {w: '100%', h: '100%', bg: 'transparent'},
        React.createElement(
          react.Flex,
          {
            position: 'absolute',
            top: '2%',
            right: '2%',
            width: '100%',
            direction: 'row',
            justify: 'end',
          },
          React.createElement(
            react.IconButton,
            {
              size: 'lg',
              borderRadius: '50%',
              'aria-label': 'close',
              boxShadow: '2px 2px 20px gray',
              onClick: () => setDisplayModal(false),
            },
            React.createElement(UnsafeIcon, {i: 'close'})
          )
        ),
        React.createElement(
          react.Flex,
          {position: 'absolute', top: '10%', bottom: '20%', width: '100%', direction: 'row'},
          React.createElement(
            react.Flex,
            {flex: '0 0 10%', justify: 'center', align: 'center'},
            React.createElement(
              react.IconButton,
              {
                size: 'lg',
                borderRadius: '50%',
                'aria-label': 'previous',
                boxShadow: '2px 2px 20px gray',
                onClick: () => setCurrentIndex(i => (i === 0 ? pictures.length - 1 : i - 1)),
              },
              React.createElement(UnsafeIcon, {i: 'chevron-left'})
            )
          ),
          React.createElement(
            react.Flex,
            {flex: '1', justify: 'center', align: 'center'},
            React.createElement(react.Image, {
              src: pictures[currentIndex],
              alt: `picture[${currentIndex}]`,
              borderRadius: '10px',
            })
          ),
          React.createElement(
            react.Flex,
            {flex: '0 0 10%', justify: 'center', align: 'center'},
            React.createElement(
              react.IconButton,
              {
                size: 'lg',
                borderRadius: '50%',
                'aria-label': 'next',
                onClick: () => setCurrentIndex(i => (i === pictures.length - 1 ? 0 : i + 1)),
              },
              React.createElement(UnsafeIcon, {i: 'chevron-right'})
            )
          )
        ),
        React.createElement(
          react.Flex,
          {
            position: 'absolute',
            w: '100%',
            margin: 'auto',
            bottom: '20px',
            display: 'flex',
            boxShadow: 'none',
            gap: '5',
            align: 'center',
            justify: 'center',
          },
          pictures.map((p, i) =>
            React.createElement(
              react.Button,
              {
                variant: 'unstyled',
                h: 'auto',
                onClick: () => setCurrentIndex(i),
                border: i === currentIndex ? '5px' : '0',
                borderColor: 'primary',
                borderStyle: 'solid',
                borderRadius: '10px',
                overflow: 'hidden',
                key: p,
              },
              React.createElement(react.Image, {
                src: p,
                alt: `picture[${i}]`,
                w: '120px',
                h: '120px',
              })
            )
          )
        )
      )
    )
  )
}

const SkelText = ({skelProps, children, ...textProps}) =>
  React.createElement(
    react.Skeleton,
    {isLoaded: typeof children !== 'undefined', ...(skelProps ?? {})},
    React.createElement(react.Text, {...textProps}, children)
  )

const TimelineItem = ({first, last, tagIcon, label, children}) => {
  const primary = react.useToken('colors', 'blue.500')
  const extraCss =
    first && last
      ? {
          borderImage: `linear-gradient(to bottom, transparent 50%, ${primary} 50%, ${primary} 50%, transparent 50%)`,
          borderImageSlice: 1,
        }
      : first
      ? {
          borderImage: `linear-gradient(to bottom, transparent 50%, ${primary} 50%)`,
          borderImageSlice: 1,
        }
      : last
      ? {
          borderImage: `linear-gradient(to bottom, ${primary} 50%, transparent 50%)`,
          borderImageSlice: 1,
        }
      : {}
  return React.createElement(
    react.ListItem,
    {role: 'group'},
    React.createElement(
      react.HStack,
      null,
      React.createElement(
        react.Flex,
        {justify: 'end', align: 'stretch', pr: '5', flex: '0 0 160px'},
        React.createElement(
          react.Tag,
          {size: 'sm', borderRadius: 'full', variant: 'solid', colorScheme: 'blue'},
          React.createElement(react.TagLeftIcon, {
            as: () => React.createElement(UnsafeIcon, {i: tagIcon}),
          }),
          React.createElement(react.TagLabel, {ml: '1'}, label)
        )
      ),
      React.createElement(
        react.Flex,
        {
          align: 'center',
          borderLeft: '2px solid',
          borderColor: 'blue.500',
          flex: '1',
          __css: extraCss,
        },
        React.createElement(
          react.HStack,
          {justify: 'stretch', py: '5'},
          React.createElement(react.Circle, {size: '16px', bg: 'blue.500', ml: '-9px'}),
          children
        )
      )
    )
  )
}
function Timeline({items, Component, tagExtractor}) {
  return React.createElement(
    react.UnorderedList,
    {listStyleType: 'none'},
    items.map((item, index) =>
      React.createElement(
        TimelineItem,
        {key: index, first: index === 0, last: index === items.length - 1, ...tagExtractor(item)},
        React.createElement(Component, {item: item})
      )
    )
  )
}

const FileUpload = ({title, subtitle, onChange: onUpload, children, error}) => {
  const [err, setErr] = React.useState(error ?? null)
  React.useEffect(() => {
    if (error) setErr(error)
  }, [error])
  return React.createElement(
    react.Box,
    {
      position: 'relative',
      w: '100%',
      minH: '256px',
      borderColor: err ? 'red.300' : 'gray.300',
      borderStyle: 'dashed',
      borderWidth: '2px',
      rounded: 'md',
      shadow: 'sm',
      _hover: {
        shadow: 'md',
      },
    },
    React.createElement(
      react.Box,
      {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      React.createElement(
        react.Stack,
        {
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justify: children ? 'start' : 'center',
          mt: '5',
          spacing: '4',
        },
        React.createElement(
          react.Stack,
          {p: '8', textAlign: 'center', spacing: '1'},
          React.createElement(
            react.Heading,
            {fontSize: 'lg', color: 'gray.700', fontWeight: 'bold'},
            title
          ),
          React.createElement(react.Text, {fontWeight: 'light'}, subtitle),
          err && React.createElement(react.Text, {color: 'red.500'}, err)
        )
      )
    ),
    React.createElement(react.Input, {
      onChange: e => {
        if (e.target.files) {
          setErr(null)
          let files = []
          for (let i = 0; i < e.target.files.length; i++) {
            if (e.target.files[i]) files = [...files, e.target.files[i]]
          }
          if (files.length > 0) onUpload(files)
        }
      },
      title: ' ',
      color: 'transparent',
      type: 'file',
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: '0',
      left: '0',
      opacity: '0',
      'aria-hidden': 'true',
      multiple: true,
    }),
    children
  )
}

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)'
function useRaisedShadow(value) {
  const boxShadow = framerMotion.useMotionValue(inactiveShadow)
  React.useEffect(() => {
    let isActive = false
    value.onChange(latest => {
      const wasActive = isActive
      if (latest !== 0) {
        isActive = true
        if (isActive !== wasActive) {
          framerMotion.animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)')
        }
      } else {
        isActive = false
        if (isActive !== wasActive) {
          framerMotion.animate(boxShadow, inactiveShadow)
        }
      }
    })
  }, [value, boxShadow])
  return boxShadow
}

const Image = ({p, onDelete, containerRef}) => {
  const y = framerMotion.useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  return React.createElement(
    framerMotion.Reorder.Item,
    {
      value: p,
      drag: true,
      dragConstraints: containerRef,
      style: {
        y,
        boxShadow,
        width: 200,
        height: 200,
        backgroundImage: `url(${p.src})`,
        backgroundSize: 'cover',
        position: 'relative',
      },
    },
    React.createElement(
      react.IconButton,
      {
        'aria-label': 'remove',
        onClick: onDelete,
        position: 'absolute',
        right: '2',
        borderRadius: '50%',
      },
      React.createElement(UnsafeIcon, {i: 'trash'})
    )
  )
}
const ImageFileUpload = ({onChange, defaultFiles = [], error}) => {
  const [images, setImages] = React.useState(defaultFiles)
  const ref = React.useRef(null)
  React.useEffect(() => {
    onChange(images)
  }, [images])
  return React.createElement(
    FileUpload,
    {
      error: error,
      onChange: fs =>
        setImages(ps => [...ps, ...fs.map(f => ({src: URL.createObjectURL(f), fileRef: f}))]),
      title: 'Drop Files',
      subtitle: 'Or click to upload',
    },
    images.length > 0 &&
      React.createElement(
        react.Box,
        {mt: '100px', background: 'bgBlue', p: '5'},
        React.createElement(
          framerMotion.Reorder.Group,
          {
            ref: ref,
            as: 'ul',
            values: images,
            onReorder: setImages,
            style: {display: 'flex', flexWrap: 'wrap', gap: '20px', listStyle: 'none'},
          },
          images.map(p =>
            React.createElement(Image, {
              containerRef: ref,
              key: p.src,
              p: p,
              onDelete: () => setImages(ps => ps.filter(pic => p !== pic)),
            })
          )
        )
      )
  )
}

const VerticalDrawer = ({
  title,
  children,
  expandedWidth,
  bg = 'blue.50',
  icon = 'chevrons-right',
  defaultCollapsed = false,
  ...props
}) => {
  const [isCollapsed, setCollapsed] = react.useBoolean(defaultCollapsed)
  return React.createElement(
    react.Box,
    {
      bg: bg,
      p: isCollapsed ? '3' : '5',
      minH: '100vh',
      w: isCollapsed ? '60px' : expandedWidth,
      borderRight: '1px',
      borderColor: 'gray.100',
      transition: 'width .3s ease',
      ...props,
    },
    React.createElement(
      react.Stack,
      {direction: isCollapsed ? 'column-reverse' : 'row', justify: 'space-between', mb: '5'},
      React.createElement(
        react.Heading,
        {
          sx: isCollapsed
            ? {
                writingMode: 'vertical-lr',
                display: 'flex',
                alignItems: 'center',
                transform: 'rotate(180deg)',
                mt: 2,
              }
            : {},
          size: 'md',
        },
        title
      ),
      React.createElement(react.IconButton, {
        onClick: setCollapsed.toggle,
        colorScheme: 'blue',
        width: 'fit-content',
        'aria-label': isCollapsed ? 'expand' : 'collapse',
        variant: isCollapsed ? 'solid' : 'link',
        rounded: 'full',
        icon: React.createElement(
          react.Box,
          {style: {transform: isCollapsed ? 'none' : 'rotate(180deg)'}},
          React.createElement(CustomIcon, {i: icon})
        ),
      })
    ),
    !isCollapsed && React.createElement(react.Divider, null),
    isCollapsed
      ? React.createElement(React.Fragment, null)
      : React.createElement(React.Fragment, null, children)
  )
}

let _globalToast = null
const ID = 'toast-container'
const ToastContainer = props => {
  const {ToastContainer: Container, toast} = React.useMemo(
    () => react.createStandaloneToast(props),
    [props]
  )
  React.useEffect(() => {
    _globalToast = toast
  }, [toast])
  return React.createElement('div', {id: ID}, React.createElement(Container, null))
}
const Statuses = ['error', 'info', 'loading', 'success', 'warning']
const toast = Object.assign(options => _globalToast?.(options) ?? '', {
  update(id, options) {
    _globalToast?.update(id, options)
  },
  promise: (promise, options) => {
    return _globalToast?.promise(promise, options)
  },
  closeAll: options => {
    _globalToast?.closeAll(options)
  },
  close: id => {
    _globalToast?.close(id)
  },
  isActive: id => _globalToast?.isActive(id) || false,
  ...Statuses.reduce(
    (acc, s) => ({
      ...acc,
      [s]: (title, opts) => _globalToast?.({...opts, status: s, title}),
    }),
    {}
  ),
})

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }
  static getDerivedStateFromError(_) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true}
  }
  handleUncaughtError(event) {
    const error = event.reason
    this.props.onError(error)
  }
  componentDidMount() {
    if (window) {
      window.addEventListener('unhandledrejection', e => this.handleUncaughtError(e))
    }
  }
  componentWillUnmount() {
    if (window) {
      window.removeEventListener('unhandledrejection', e => this.handleUncaughtError(e))
    }
  }
  componentDidCatch(error, _) {
    // You can also log the error to an error reporting service
    this.props.onError(error)
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return React.createElement('h1', null, 'Something went wrong.')
    }
    return React.createElement(React.Fragment, null, this.props.children)
  }
}

/**
 * Listens on Errors which might happen
 * @returns
 */
const ErrorListener = ({
  children,
  getToastFromError: getToastFromError = e => ({
    title: e.message,
    status: 'error',
    isClosable: true,
  }),
  onError,
}) => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(ToastContainer, null),
    React.createElement(
      ErrorBoundary,
      {
        onError: e => {
          onError?.(e)
          const t = getToastFromError(e)
          if (t) toast(t)
        },
      },
      children
    )
  )
}

exports.AutoForm = AutoForm
exports.CustomIcon = CustomIcon
exports.EditableText = EditableText
exports.ErrorBoundary = ErrorBoundary
exports.ErrorListener = ErrorListener
exports.FileUpload = FileUpload
exports.FormControlWithError = FormControlWithError
exports.ImageFileUpload = ImageFileUpload
exports.LabelInFront = LabelInFront
exports.PictureGallery = PictureGallery
exports.SkelText = SkelText
exports.Timeline = Timeline
exports.ToastContainer = ToastContainer
exports.TypedField = TypedField
exports.UnsafeIcon = UnsafeIcon
exports.VerticalDrawer = VerticalDrawer
exports.createIconContext = createIconContext
exports.leftAddOn = leftAddOn
exports.rightAddOn = rightAddOn
exports.toast = toast
exports.zInput = zInput
