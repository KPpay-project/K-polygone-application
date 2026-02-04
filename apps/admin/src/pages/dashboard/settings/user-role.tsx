import AddUserAction from '@/components/actions/add-user-action';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useNavigate } from '@tanstack/react-router';
import { Edit, MoreHorizontal, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface Role {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Has full system audit access, sets policies, and manages all admin roles.',
    memberCount: 2,
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  },
  {
    id: '2',
    name: 'Country Manager',
    description:
      'Manages day-to-day operations in their country, supervising Regional Admins and handling escalated issues.',
    memberCount: 0,
    members: []
  },
  {
    id: '3',
    name: 'Regional Admin',
    description:
      'Manages day-to-day activities in their region, including user verifications, fraud checks, and reports.',
    memberCount: 3,
    members: [
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
      { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' },
      { id: '5', name: 'David Brown', email: 'david@example.com' }
    ]
  },
  {
    id: '4',
    name: 'Support Staff',
    description:
      'Focus on customer service, handling tickets, disputes, and account assistance with limited system access.',
    memberCount: 4,
    members: [
      { id: '6', name: 'Emily Davis', email: 'emily@example.com' },
      { id: '7', name: 'Chris Miller', email: 'chris@example.com' },
      { id: '8', name: 'Lisa Garcia', email: 'lisa@example.com' },
      { id: '9', name: 'Tom Anderson', email: 'tom@example.com' }
    ]
  }
];

export default function UserRolePage() {
  const navigate = useNavigate();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleViewUsers = () => {
    navigate({ to: '/dashboard/user/lists' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Roles and Permission</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your members' roles and allocate permission</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Add users
          </Button>
          <Button
            onClick={() => navigate({ to: '/dashboard/settings/create-role' })}
            className="bg-blue-700 hover:bg-blue-900 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Role
          </Button>
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {mockRoles.map((role) => (
          <Card key={role.id} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {role.memberCount} members
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 max-w-2xl">{role.description}</p>

                  {/* Members */}
                  {role.members.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {role.members.slice(0, 3).map((member) => (
                          <div key={member.id} className="relative">
                            <UserAvatar name={''} email={''} avatar={member.avatar} size="sm" />
                          </div>
                        ))}
                        {role.members.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{role.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewUsers}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View users
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 ease-out focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors duration-150" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus:ring-0 focus:border-transparent"
                        onClick={() =>
                          navigate({ to: '/dashboard/settings/create-role', search: { editRole: role.id } })
                        }
                      >
                        <Edit className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-gray-700">Edit Role</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:outline-none focus:ring-0 focus:border-transparent">
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Delete Role</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add User Modal */}
      <DefaultModal
        trigger={<></>}
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add User"
        canExit={true}
      >
        <AddUserAction />
      </DefaultModal>
    </div>
  );
}
