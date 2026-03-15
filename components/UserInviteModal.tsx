import React from 'react'
import UserUpsertForm from './UserUpsertForm'
import { User } from '@/types'
const UserInviteModal = (props: {
    handleCloseModal : () => void,
    formData: Partial<User>,
    setFormData: (user: Partial<User>) => void,
}) => {

  const handleSubmit = async () => {

  }

  return (
    <UserUpsertForm handleSubmit={() => handleSubmit()} title="Invite New User" submitTitle='Send Invite'  {...props}/>
  )
}

export default UserInviteModal