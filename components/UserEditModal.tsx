import { User } from '@/types'
import React from 'react'
import UserUpsertForm from './UserUpsertForm'

const UserEditModal = (props: {
    handleCloseModal : () => void,
    formData: Partial<User>,
    userId: string
    setFormData: (user: Partial<User>) => void,
}) => {
    const handleSubmit = async () => {

    }

  return (
    <UserUpsertForm handleSubmit={() => handleSubmit()} title="Edit User" submitTitle='Save Changes'  {...props}/>
  )
}

export default UserEditModal