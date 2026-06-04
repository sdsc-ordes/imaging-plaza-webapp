import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  private handleReload = () => {
    this.setState({ hasError: false })
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center" p={6}>
        <VStack spacing={4} textAlign="center" maxW="lg">
          <Heading size="lg">Something went wrong</Heading>
          <Text color="gray.600">
            An unexpected error occurred while rendering this page. Reloading usually fixes it.
          </Text>
          <Button colorScheme="blue" onClick={this.handleReload}>
            Reload page
          </Button>
        </VStack>
      </Box>
    )
  }
}
