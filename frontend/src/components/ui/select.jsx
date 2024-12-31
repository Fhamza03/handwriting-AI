export function Select({ children, value, onValueChange }) {
    return (
      <select 
        value={value} 
        onChange={(e) => onValueChange(e.target.value)}
        className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
    )
  }
  
  export function SelectTrigger({ className, children }) {
    return <div className={`flex items-center ${className}`}>{children}</div>
  }
  
  export function SelectValue({ children }) {
    return <span>{children}</span>
  }
  
  export function SelectContent({ children }) {
    return <div>{children}</div>
  }
  
  export function SelectItem({ value, children }) {
    return <option value={value}>{children}</option>
  }