import { Department } from '@/types'
import React from 'react'
import DepartmentUpsertForm from './DepartmentUpsertForm'
import { AppState, useStore } from '@/context/Store'
import { useAssignBusinessRolePermissions, useCreateBusinessRole } from '@/services/business/hooks'
import { toast } from 'sonner'
import { BusinessPermission } from '@/services/business/types'

const DepartmentCreateModal = (props:{
    handleCloseModal : () => void,
    formData: Partial<Department>,
    setFormData:  React.Dispatch<React.SetStateAction<{
        name: string;
        description: string;
        permissions: Array<BusinessPermission>;
    }>>,
    isLoading?: boolean
}) => {

    const {state}: {state: AppState} = useStore();
    const [roleId , setRoleId] = React.useState<string>("")
    const createBusinessRole = useCreateBusinessRole({
        successFn: (data) => {
            toast.success("Department created successfully")
        },
        failureFn: (error) => {
            const message = ""
            toast.error(`Error creating department`)
        }
    })
    const addPermissionToRole = useAssignBusinessRolePermissions(
        {
        successFn: (data) => {
            toast.success("Department created successfully")
        },
        failureFn: (error) => {
            const message = ""
            toast.error(`Error creating department`)
        }
        }
    )
    const handleSubmit = async () => {
        try{
            const data = await createBusinessRole.mutateAsync({
                businessId : state?.organization?.id ?? "",
                payload: {
                    role: props.formData.name ?? ""
                },
            })
            console.log(data.data[0].id)
            const role_id = data.data[0].id;
            setRoleId(role_id)
            addPermissionToRole.mutate({
                businessId : state?.organization?.id ?? "",
                roleId: role_id,
                payload: {
                    permissions: props?.formData.permissions ?? []
                }
            })
            props.handleCloseModal()
        }catch(error){
            toast.error(`Error creating department`)
        }
       

    }
  return (
    <DepartmentUpsertForm  title='Create New Department' submitTitle= 'Create Department' isLoading={addPermissionToRole.isPending || createBusinessRole.isPending}  handleSubmit={()=>handleSubmit()} {...props}/>
  )
}

export default DepartmentCreateModal

// {editingDept ? 'Update Department' : 'Create Department'}

// {editingDept ? 'Edit Department' : 'Create New Department'}