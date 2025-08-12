import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LoginForm } from '../login-form'
import { signIn } from '@/lib/auth-client'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock('@/lib/auth-client', () => ({
  signIn: {
    email: vi.fn(),
  },
}))

describe('LoginForm', () => {
  const mockPush = vi.fn()
  const mockSignIn = vi.mocked(signIn.email)
  const mockToastError = vi.mocked(toast.error)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    })
  })

  it('renders login form with all required elements', () => {
    render(<LoginForm />)

    expect(screen.getByRole('heading', { name: 'Login to your account' })).toBeInTheDocument()
    expect(screen.getByText('Enter your email below to login to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Forgot your password?' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument()
  })

  it('updates email input value when typed', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement
    await user.type(emailInput, 'test@example.com')

    expect(emailInput.value).toBe('test@example.com')
  })

  it('updates password input value when typed', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
    await user.type(passwordInput, 'password123')

    expect(passwordInput.value).toBe('password123')
  })

  it('calls signIn with correct email and password when login button is clicked', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ data: { user: { id: '1' } }, error: null })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('redirects to dashboard on successful login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ data: { user: { id: '1' } }, error: null })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('displays error toast on login failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'
    mockSignIn.mockResolvedValue({ data: null, error: { message: errorMessage } })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(errorMessage)
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('disables login button while loading', async () => {
    const user = userEvent.setup()
    let resolveSignIn: (value: { data: { user: { id: string } } | null; error: { message: string } | null }) => void
    const signInPromise = new Promise<{ data: { user: { id: string } } | null; error: { message: string } | null }>((resolve) => {
      resolveSignIn = resolve
    })
    mockSignIn.mockReturnValue(signInPromise)

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    expect(loginButton).toBeDisabled()

    // Resolve the promise to finish loading
    resolveSignIn!({ data: { user: { id: '1' } }, error: null })
    await waitFor(() => {
      expect(loginButton).not.toBeDisabled()
    })
  })

  it('has correct form structure and attributes', () => {
    render(<LoginForm />)

    // Find form element by tag name instead of role
    const form = document.querySelector('form')
    expect(form).toHaveClass('flex', 'flex-col', 'gap-6')

    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('placeholder', 'm@example.com')
    expect(emailInput).toBeRequired()

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toBeRequired()
  })

  it('handles button click directly without form submit event', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ data: { user: { id: '1' } }, error: null })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    // Click the button directly (your component handles onClick, not form submission)
    await user.click(loginButton)

    expect(mockSignIn).toHaveBeenCalledOnce()
  })
})