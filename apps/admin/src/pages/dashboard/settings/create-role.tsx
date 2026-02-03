import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PERMISSIONS, Permission } from '@/constants/permissions';
import { ROLE_MODULES } from '@/constants/role-modules';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface CreateRolePageProps {
  editRole?: Role;
  isEditMode?: boolean;
}

// Group permissions by module for better organization
const groupPermissionsByModule = (permissions: Permission[]) => {
  return ROLE_MODULES.map((module) => ({
    name: module.name,
    permissions: permissions.filter(module.matcher)
  })).filter((module) => module.permissions.length > 0);
};

export default function CreateRolePage({ editRole, isEditMode = false }: CreateRolePageProps) {
  const [roleName, setRoleName] = useState('');
  const [rolePermissions, setRolePermissions] = useState<Permission[]>(PERMISSIONS);
  // Separate state for CRUD permissions
  const [crudPermissions, setCrudPermissions] = useState<Record<string, boolean>>({});

  // Populate form when in edit mode
  useEffect(() => {
    if (isEditMode && editRole) {
      setRoleName(editRole.name);
      // Set permissions based on editRole.permissions
      setRolePermissions((prev) =>
        prev.map((permission) => ({
          ...permission,
          checked: editRole.permissions.includes(permission.id)
        }))
      );
      // Set CRUD permissions
      const crudPerms: Record<string, boolean> = {};
      editRole.permissions.forEach((permId) => {
        crudPerms[permId] = true;
      });
      setCrudPermissions(crudPerms);
    } else {
      // Reset form when not in edit mode
      setRoleName('');
      setRolePermissions(PERMISSIONS);
      setCrudPermissions({});
    }
  }, [isEditMode, editRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine regular permissions and CRUD permissions
    const selectedPermissions = rolePermissions.filter((p) => p.checked);
    const selectedCrudPermissions = Object.keys(crudPermissions).filter((key) => crudPermissions[key]);

    const allSelectedPermissions = [...selectedPermissions.map((p) => p.id), ...selectedCrudPermissions];

    if (isEditMode) {
      console.log('Updating role:', {
        id: editRole?.id,
        name: roleName,
        permissions: allSelectedPermissions
      });
    } else {
      console.log('Creating role:', {
        name: roleName,
        permissions: allSelectedPermissions
      });
    }
    // Handle role creation/update logic here
  };

  const handleReset = () => {
    if (isEditMode && editRole) {
      setRoleName(editRole.name);
      setRolePermissions((prev) =>
        prev.map((permission) => ({
          ...permission,
          checked: editRole.permissions.includes(permission.id)
        }))
      );
      // Reset CRUD permissions
      const crudPerms: Record<string, boolean> = {};
      editRole.permissions.forEach((permId) => {
        crudPerms[permId] = true;
      });
      setCrudPermissions(crudPerms);
    } else {
      setRoleName('');
      setRolePermissions(PERMISSIONS);
      setCrudPermissions({});
    }
  };

  const groupedPermissions = groupPermissionsByModule(rolePermissions);

  return (
    <div className="w-full max-w-none space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{isEditMode ? 'Edit Role' : 'Create Role'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="role-name" className="text-sm font-medium">
                Role
              </Label>
              <Input
                id="role-name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g Country Manager"
                className="mt-1"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Permission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium text-gray-900 w-32 sm:w-48 min-w-[120px]">Module</TableHead>
                    <TableHead className="font-medium text-gray-900 text-center w-16 sm:w-24 min-w-[60px]">
                      Create
                    </TableHead>
                    <TableHead className="font-medium text-gray-900 text-center w-16 sm:w-24 min-w-[60px]">
                      View
                    </TableHead>
                    <TableHead className="font-medium text-gray-900 text-center w-16 sm:w-24 min-w-[60px]">
                      Update
                    </TableHead>
                    <TableHead className="font-medium text-gray-900 text-center w-16 sm:w-24 min-w-[60px]">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedPermissions.map((module, index) => (
                    <TableRow key={module.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <TableCell className="font-medium text-gray-900 py-3 sm:py-4 text-sm">{module.name}</TableCell>
                      <TableCell className="text-center py-3 sm:py-4">
                        <Checkbox
                          id={`create-${module.name}`}
                          checked={crudPermissions[`${module.name.toLowerCase()}_create`] || false}
                          onCheckedChange={(checked) => {
                            setCrudPermissions((prev) => ({
                              ...prev,
                              [`${module.name.toLowerCase()}_create`]: !!checked
                            }));
                          }}
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center py-3 sm:py-4">
                        <Checkbox
                          id={`view-${module.name}`}
                          checked={crudPermissions[`${module.name.toLowerCase()}_view`] || false}
                          onCheckedChange={(checked) => {
                            setCrudPermissions((prev) => ({
                              ...prev,
                              [`${module.name.toLowerCase()}_view`]: !!checked
                            }));
                          }}
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center py-3 sm:py-4">
                        <Checkbox
                          id={`update-${module.name}`}
                          checked={crudPermissions[`${module.name.toLowerCase()}_update`] || false}
                          onCheckedChange={(checked) => {
                            setCrudPermissions((prev) => ({
                              ...prev,
                              [`${module.name.toLowerCase()}_update`]: !!checked
                            }));
                          }}
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center py-3 sm:py-4">
                        <Checkbox
                          id={`delete-${module.name}`}
                          checked={crudPermissions[`${module.name.toLowerCase()}_delete`] || false}
                          onCheckedChange={(checked) => {
                            setCrudPermissions((prev) => ({
                              ...prev,
                              [`${module.name.toLowerCase()}_delete`]: !!checked
                            }));
                          }}
                          className="mx-auto"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleReset} className="px-6 order-2 sm:order-1">
            Reset
          </Button>
          <Button type="submit" className="px-6 bg-blue-700 hover:bg-blue-800 text-white order-1 sm:order-2">
            {isEditMode ? 'Update Role' : 'Create New Role'}
          </Button>
        </div>
      </form>
    </div>
  );
}
