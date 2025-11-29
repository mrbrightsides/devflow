export interface BuggyExample {
  id: string;
  title: string;
  description: string;
  language: string;
  errorType: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const buggyExamples: BuggyExample[] = [
  {
    id: 'div-by-zero',
    title: 'Division by Zero',
    description: 'Function that attempts to divide by zero without error handling',
    language: 'python',
    errorType: 'ZeroDivisionError',
    difficulty: 'easy',
    code: `def calculate_average(numbers):
    total = sum(numbers)
    count = len(numbers)
    return total / count

# This will crash with empty list
result = calculate_average([])
print(result)`,
  },
  {
    id: 'syntax-error',
    title: 'Missing Closing Parenthesis',
    description: 'Function with syntax error - missing closing parenthesis',
    language: 'python',
    errorType: 'SyntaxError',
    difficulty: 'easy',
    code: `def greet(name):
    message = "Hello, " + name
    print(message
    return message

greet("World")`,
  },
  {
    id: 'type-error',
    title: 'Type Mismatch',
    description: 'String concatenation with integer without conversion',
    language: 'python',
    errorType: 'TypeError',
    difficulty: 'easy',
    code: `def display_age(name, age):
    message = "User " + name + " is " + age + " years old"
    return message

print(display_age("Alice", 25))`,
  },
  {
    id: 'index-error',
    title: 'List Index Out of Range',
    description: 'Accessing list index that does not exist',
    language: 'python',
    errorType: 'IndexError',
    difficulty: 'medium',
    code: `def get_first_and_last(items):
    first = items[0]
    last = items[-1]
    return first, last

# This will crash with empty list
result = get_first_and_last([])
print(result)`,
  },
  {
    id: 'undefined-var',
    title: 'Undefined Variable',
    description: 'Using a variable before it is defined',
    language: 'python',
    errorType: 'NameError',
    difficulty: 'medium',
    code: `def calculate_total(price, quantity):
    subtotal = price * quantity
    tax = subtotal * tax_rate
    return subtotal + tax

# tax_rate is not defined
total = calculate_total(10, 5)
print(total)`,
  },
  {
    id: 'infinite-loop',
    title: 'Infinite Loop',
    description: 'Loop that never terminates due to incorrect condition',
    language: 'python',
    errorType: 'LogicError',
    difficulty: 'medium',
    code: `def countdown(n):
    while n > 0:
        print(n)
        n = n + 1  # Bug: should be n - 1
    print("Done!")

countdown(5)`,
  },
  {
    id: 'null-reference',
    title: 'Null Reference',
    description: 'Attempting to access attribute on None object',
    language: 'python',
    errorType: 'AttributeError',
    difficulty: 'medium',
    code: `def process_user(user_data):
    name = user_data.get('name')
    email = user_data.get('email')
    
    # Bug: name could be None
    return name.upper() + " - " + email

user = {'email': 'test@example.com'}
result = process_user(user)
print(result)`,
  },
  {
    id: 'file-not-found',
    title: 'Missing File Handling',
    description: 'Opening a file without error handling',
    language: 'python',
    errorType: 'FileNotFoundError',
    difficulty: 'hard',
    code: `def read_config(filename):
    file = open(filename, 'r')
    data = file.read()
    file.close()
    return data

# File might not exist
config = read_config('config.txt')
print(config)`,
  },
];

export function getExampleById(id: string): BuggyExample | undefined {
  return buggyExamples.find((example: BuggyExample) => example.id === id);
}

export function getExamplesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): BuggyExample[] {
  return buggyExamples.filter((example: BuggyExample) => example.difficulty === difficulty);
}
