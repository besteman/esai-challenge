import { render, screen, fireEvent } from "@testing-library/react";

import { TextInput } from "../textInput";

// Mock HeroUI components
jest.mock("@heroui/button", () => ({
  Button: ({ children, isDisabled, color, onClick, ...props }: any) => (
    <button
      data-color={color}
      disabled={isDisabled}
      {...props}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

jest.mock("@heroui/input", () => ({
  Textarea: ({
    value,
    label,
    placeholder,
    errorMessage,
    isInvalid,
    description,
    onValueChange,
    ...props
  }: any) => (
    <div>
      <label htmlFor="textarea-input">{label}</label>
      <textarea
        data-invalid={isInvalid}
        id="textarea-input"
        placeholder={placeholder}
        value={value}
        {...props}
        onChange={(e) => onValueChange?.(e.target.value)}
      />
      {description && <div data-testid="description">{description}</div>}
      {errorMessage && <div data-testid="error-message">{errorMessage}</div>}
    </div>
  ),
}));

describe("TextInput Component", () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    question: "What is your experience?",
    label: "Experience",
    placeholder: "Tell us about your experience...",
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Functionality", () => {
    it("renders with required props", () => {
      render(<TextInput {...defaultProps} />);

      expect(screen.getByText("What is your experience?")).toBeInTheDocument();
      expect(screen.getByLabelText("Experience")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Tell us about your experience..."),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });

    it("renders with custom button text and color", () => {
      render(<TextInput {...defaultProps} buttonText="Submit" />);

      const button = screen.getByRole("button", { name: "Submit" });

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-color", "success");
    });

    it("renders with initial value", () => {
      render(<TextInput {...defaultProps} initialValue="Initial text" />);

      expect(screen.getByDisplayValue("Initial text")).toBeInTheDocument();
    });
  });

  describe("Word Count Validation", () => {
    it("shows word count description by default", () => {
      render(<TextInput {...defaultProps} />);

      expect(screen.getByTestId("description")).toBeInTheDocument();
      expect(screen.getByTestId("description")).toHaveTextContent(
        "0/50 words (minimum 20)",
      );
    });

    it("updates word count as user types", () => {
      render(<TextInput {...defaultProps} />);

      const textarea = screen.getByLabelText("Experience");

      fireEvent.change(textarea, { target: { value: "This is a test" } });

      expect(screen.getByTestId("description")).toHaveTextContent(
        "4/50 words (minimum 20)",
      );
    });

    it("shows minimum text in gray when under 20 words", () => {
      render(<TextInput {...defaultProps} />);

      const textarea = screen.getByLabelText("Experience");

      fireEvent.change(textarea, { target: { value: "Short text" } });

      const description = screen.getByTestId("description");
      const minimumSpan = description.querySelector("span.text-gray-500");

      expect(minimumSpan).toBeInTheDocument();
      expect(minimumSpan).toHaveTextContent("minimum 20");
    });

    it("shows minimum text in green when 20 or more words", () => {
      render(<TextInput {...defaultProps} />);

      const textarea = screen.getByLabelText("Experience");
      const twentyWords = Array(20).fill("word").join(" ");

      fireEvent.change(textarea, { target: { value: twentyWords } });

      const description = screen.getByTestId("description");
      const minimumSpan = description.querySelector("span.text-green-600");

      expect(minimumSpan).toBeInTheDocument();
      expect(minimumSpan).toHaveTextContent("minimum 20");
    });

    it("validates input and shows button state correctly", () => {
      render(<TextInput {...defaultProps} />);

      const textarea = screen.getByLabelText("Experience");
      const button = screen.getByRole("button", { name: "Next" });

      // Initially disabled (empty input)
      expect(button).toBeDisabled();

      // Still disabled with too few words
      fireEvent.change(textarea, { target: { value: "Too short" } });
      expect(button).toBeDisabled();

      // Still disabled with too many words
      const tooManyWords = Array(51).fill("word").join(" ");

      fireEvent.change(textarea, { target: { value: tooManyWords } });
      expect(button).toBeDisabled();

      // Enabled with valid word count
      const validText = Array(25).fill("word").join(" ");

      fireEvent.change(textarea, { target: { value: validText } });
      expect(button).not.toBeDisabled();

      // Can submit with valid input
      fireEvent.click(button);
      expect(mockOnSubmit).toHaveBeenCalledWith(validText);
    });
  });

  describe("Disable Word Count Feature", () => {
    it("hides word count description when disabled", () => {
      render(<TextInput {...defaultProps} disableWordCount={true} />);

      expect(screen.queryByTestId("description")).not.toBeInTheDocument();
    });

    it("skips word count validation when disabled", () => {
      render(<TextInput {...defaultProps} disableWordCount={true} />);

      const textarea = screen.getByLabelText("Experience");
      const button = screen.getByRole("button", { name: "Next" });

      fireEvent.change(textarea, { target: { value: "Short" } });
      expect(button).not.toBeDisabled();

      fireEvent.click(button);
      expect(mockOnSubmit).toHaveBeenCalledWith("Short");
    });

    it("still validates blank input when word count is disabled", () => {
      render(<TextInput {...defaultProps} disableWordCount={true} />);

      const button = screen.getByRole("button", { name: "Next" });

      expect(button).toBeDisabled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Button State", () => {
    it("disables button when input is invalid", () => {
      render(<TextInput {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Next" });

      expect(button).toBeDisabled();

      const textarea = screen.getByLabelText("Experience");

      fireEvent.change(textarea, { target: { value: "Short text" } });
      expect(button).toBeDisabled(); // Still disabled due to word count

      const validText = Array(25).fill("word").join(" ");

      fireEvent.change(textarea, { target: { value: validText } });
      expect(button).not.toBeDisabled();
    });

    it("respects external disabled prop", () => {
      render(<TextInput {...defaultProps} disabled={true} />);

      const button = screen.getByRole("button", { name: "Next" });

      expect(button).toBeDisabled();

      const textarea = screen.getByLabelText("Experience");
      const validText = Array(25).fill("word").join(" ");

      fireEvent.change(textarea, { target: { value: validText } });
      expect(button).toBeDisabled(); // Still disabled due to external prop
    });
  });
});
