import { Department } from '@/types'
import React from 'react'
import DepartmentUpsertForm from './DepartmentUpsertForm'

const DepartmentEditModal= (props:{
    handleCloseModal : () => void,
    formData: Partial<Department>,
    setFormData:  React.Dispatch<React.SetStateAction<Department>>,
    isLoading?: boolean
}) => {
    const handleSubmit = async () => {

    }

  return (
    <DepartmentUpsertForm  title='Edit Department' submitTitle= 'Update Department' isLoading={false}  handleSubmit={()=>handleSubmit()} {...props}/>
  )
}

export default DepartmentEditModal