import React from 'react'
import UserUpsertForm from './UserUpsertForm'
import { User } from '@/types'
import { useCreateBusinessMember } from '@/services/business/hooks'
import { toast } from 'sonner'
import { AppState, useStore } from '@/context/Store'
import { generateSecurePassword } from '@/utils'
const UserInviteModal = (props: {
    handleCloseModal : () => void,
    formData: Partial<User>,
    setFormData: (user: Partial<User>) => void,
}) => {

  const {state}: { state: AppState} = useStore()
  const createbusinessUser = useCreateBusinessMember({
    successFn: (data) => {
        toast.success("User Invitation completed")
    },
    failureFn: (error) => {
      const message = ""
      toast.error(`Error Inviting User`)
    }
  });

  // const assignUserToRole = useAs


  const handleSubmit = async () => {
      // for testing 
      const password = generateSecurePassword(17)
      console.log(password)
      createbusinessUser.mutate({
        businessId: state.organization.id,
        payload: {
          first_name: props.formData.firstName,
          last_name: props.formData.lastName,
          country: props.formData.country,
          password: password,
          business_reference: state.organization.reference,
          business_email: props.formData.email,
          email: props.formData.email,
        }
      })
  }

  return (
    <UserUpsertForm isLoading={createbusinessUser.isPending} handleSubmit={() => handleSubmit()} title="Invite New User" submitTitle='Send Invite'  {...props}/>
  )
}

export default UserInviteModal