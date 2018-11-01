import * as React from 'react'

export interface CheckboxProps {
  name: string
  checked?: boolean
  label: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox = ({ name, checked, label, handleInputChange }: CheckboxProps) => (
  <div className="custom-control custom-checkbox">
    <input type="checkbox" className="custom-control-input" id={name} checked={checked} onChange={handleInputChange} name={name}/>
    <label className="custom-control-label" htmlFor={name}>
      {label}
    </label>
  </div>
)
