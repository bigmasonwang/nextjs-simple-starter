import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SignupForm } from "../signup-form"
import { signUp } from "@/lib/auth-client"

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock("@/lib/auth-client", () => ({
  signUp: {
    email: vi.fn(),
  },
}))

describe("SignupForm", () => {
  const mockPush = vi.fn()
  const mockSignUp = vi.mocked(signUp.email)
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

  it("renders signup form with all required elements", () => {
    render(<SignupForm />)

    expect(
      screen.getByRole("heading", { name: "Create an account" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Enter your information below to create your account")
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument()
  })

  it("updates name input value when typed", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const nameInput = screen.getByLabelText("Name") as HTMLInputElement
    await user.type(nameInput, "John Doe")

    expect(nameInput.value).toBe("John Doe")
  })

  it("updates email input value when typed", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    await user.type(emailInput, "test@example.com")

    expect(emailInput.value).toBe("test@example.com")
  })

  it("updates password input value when typed", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement
    await user.type(passwordInput, "password123")

    expect(passwordInput.value).toBe("password123")
  })

  it("updates confirm password input value when typed", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const confirmPasswordInput = screen.getByLabelText(
      "Confirm Password"
    ) as HTMLInputElement
    await user.type(confirmPasswordInput, "password123")

    expect(confirmPasswordInput.value).toBe("password123")
  })

  it("calls signUp with correct data when form is submitted with matching passwords", async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({ data: { user: { id: "1" } }, error: null })

    render(<SignupForm />)

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")
    const signupButton = screen.getByRole("button", { name: "Sign up" })

    await user.type(nameInput, "John Doe")
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    await user.type(confirmPasswordInput, "password123")
    await user.click(signupButton)

    expect(mockSignUp).toHaveBeenCalledWith({
      name: "John Doe",
      email: "test@example.com",
      password: "password123",
    })
  })

  it("shows error toast when passwords do not match", async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({ data: { user: { id: "1" } }, error: null })

    render(<SignupForm />)

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")
    const signupButton = screen.getByRole("button", { name: "Sign up" })

    await user.type(nameInput, "John Doe")
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    await user.type(confirmPasswordInput, "differentpassword")
    await user.click(signupButton)

    expect(mockToastError).toHaveBeenCalledWith("Passwords do not match")
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it("redirects to dashboard on successful signup", async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({ data: { user: { id: "1" } }, error: null })

    render(<SignupForm />)

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")
    const signupButton = screen.getByRole("button", { name: "Sign up" })

    await user.type(nameInput, "John Doe")
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    await user.type(confirmPasswordInput, "password123")
    await user.click(signupButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard")
    })
  })

  it("displays error toast on signup failure", async () => {
    const user = userEvent.setup()
    const errorMessage = "Email already exists"
    mockSignUp.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    })

    render(<SignupForm />)

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")
    const signupButton = screen.getByRole("button", { name: "Sign up" })

    await user.type(nameInput, "John Doe")
    await user.type(emailInput, "existing@example.com")
    await user.type(passwordInput, "password123")
    await user.type(confirmPasswordInput, "password123")
    await user.click(signupButton)

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(errorMessage)
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("disables signup button while loading", async () => {
    const user = userEvent.setup()
    let resolveSignUp: (value: {
      data: { user: { id: string } } | null
      error: { message: string } | null
    }) => void
    const signUpPromise = new Promise<{
      data: { user: { id: string } } | null
      error: { message: string } | null
    }>(resolve => {
      resolveSignUp = resolve
    })
    mockSignUp.mockReturnValue(signUpPromise)

    render(<SignupForm />)

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")
    const signupButton = screen.getByRole("button", { name: "Sign up" })

    await user.type(nameInput, "John Doe")
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    await user.type(confirmPasswordInput, "password123")
    await user.click(signupButton)

    expect(signupButton).toBeDisabled()

    // Resolve the promise to finish loading
    resolveSignUp!({ data: { user: { id: "1" } }, error: null })
    await waitFor(() => {
      expect(signupButton).not.toBeDisabled()
    })
  })

  it("has correct form structure and attributes", () => {
    render(<SignupForm />)

    const form = document.querySelector("form")
    expect(form).toHaveClass("flex", "flex-col", "gap-6")

    const nameInput = screen.getByLabelText("Name")
    expect(nameInput).toHaveAttribute("type", "text")
    expect(nameInput).toHaveAttribute("placeholder", "John Doe")
    expect(nameInput).toBeRequired()

    const emailInput = screen.getByLabelText("Email")
    expect(emailInput).toHaveAttribute("type", "email")
    expect(emailInput).toHaveAttribute("placeholder", "m@example.com")
    expect(emailInput).toBeRequired()

    const passwordInput = screen.getByLabelText("Password")
    expect(passwordInput).toHaveAttribute("type", "password")
    expect(passwordInput).toBeRequired()

    const confirmPasswordInput = screen.getByLabelText("Confirm Password")
    expect(confirmPasswordInput).toHaveAttribute("type", "password")
    expect(confirmPasswordInput).toBeRequired()

    const submitButton = screen.getByRole("button", { name: "Sign up" })
    expect(submitButton).toHaveAttribute("type", "submit")
  })

  it("handles form submission via Enter key press", async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({ data: { user: { id: "1" } }, error: null })

    render(<SignupForm />)

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")

    await user.type(nameInput, "John Doe")
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    await user.type(confirmPasswordInput, "password123")
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "password123",
      })
    })
  })

  it("prevents form submission and shows error when passwords do not match via Enter", async () => {
    const user = userEvent.setup()

    render(<SignupForm />)

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")

    await user.type(nameInput, "John Doe")
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    await user.type(confirmPasswordInput, "differentpassword")
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Passwords do not match")
    })
    expect(mockSignUp).not.toHaveBeenCalled()
  })
})
