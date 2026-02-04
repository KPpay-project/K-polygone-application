import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PERMISSIONS, Permission } from '@/constants/permissions';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editRole?: Role;
  isEditMode?: boolean;
}

export default function CreateRoleModal({ isOpen, onClose, editRole, isEditMode = false }: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [rolePermissions, setRolePermissions] = useState<Permission[]>(PERMISSIONS);

  // Populate form when in edit mode
  useEffect(() => {
    if (isEditMode && editRole) {
      setRoleName(editRole.name);
      setDescription(editRole.description);
      // Set permissions based on editRole.permissions
      setRolePermissions((prev) =>
        prev.map((permission) => ({
          ...permission,
          checked: editRole.permissions.includes(permission.id)
        }))
      );
    } else {
      // Reset form when not in edit mode
      setRoleName('');
      setDescription('');
      setRolePermissions(PERMISSIONS);
    }
  }, [isEditMode, editRole, isOpen]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setRolePermissions((prev) =>
      prev.map((permission) => (permission.id === permissionId ? { ...permission, checked } : permission))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPermissions = rolePermissions.filter((p) => p.checked);

    if (isEditMode) {
      console.log('Updating role:', {
        id: editRole?.id,
        name: roleName,
        description,
        permissions: selectedPermissions
      });
    } else {
      console.log('Creating role:', {
        name: roleName,
        description,
        permissions: selectedPermissions
      });
    }
    // Handle role creation/update logic here
    onClose();
  };

  const handleReset = () => {
    if (isEditMode && editRole) {
      setRoleName(editRole.name);
      setDescription(editRole.description);
      setRolePermissions((prev) =>
        prev.map((permission) => ({
          ...permission,
          checked: editRole.permissions.includes(permission.id)
        }))
      );
    } else {
      setRoleName('');
      setDescription('');
      setRolePermissions(PERMISSIONS);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{isEditMode ? 'Edit Role' : 'Create Role'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="role-name" className="text-sm font-medium">
                Role
              </Label>
              <Input
                id="role-name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Country Manager"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the role"
                className="mt-1 w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Permissions</Label>
              <div className="space-y-2 max-h-80 overflow-y-auto border rounded-md p-3">
                {rolePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={permission.checked}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                    />
                    <Label htmlFor={permission.id} className="text-sm font-normal cursor-pointer">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleReset} className="px-6">
              Reset
            </Button>
            <Button type="submit" className="px-6 bg-blue-700 hover:bg-red-600 text-white">
              {isEditMode ? 'Update Role' : 'Create New Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
