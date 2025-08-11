import React, { useState } from 'react';
import { UserPlus, Crown, User, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectMembers, useRemoveMember, useUpdateMemberRole } from '@/hooks/useGroupProjects';
import { MemberRole } from '@/types/api';
import { InviteMemberModal } from './invite-member-modal';

interface ProjectMembersProps {
  projectId: string;
}

export const ProjectMembers: React.FC<ProjectMembersProps> = ({ projectId }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { data: members, isLoading } = useProjectMembers(projectId);
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();

  const handleRemoveMember = (memberId: string) => {
    removeMember.mutate({ projectId, memberId });
  };

  const handleUpdateRole = (memberId: string, role: MemberRole) => {
    updateMemberRole.mutate({ projectId, memberId, updates: { role } });
  };

  const getRoleColor = (role: MemberRole) => {
    return role === MemberRole.LEADER ? 'default' : 'secondary';
  };

  const getRoleIcon = (role: MemberRole) => {
    return role === MemberRole.LEADER ? Crown : User;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading members...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button onClick={() => setShowInviteModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          {!members || members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No members found
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                const isLeader = member.role === MemberRole.LEADER;
                
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.user_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.user_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.user_email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleColor(member.role)} className="flex items-center gap-1">
                        <RoleIcon className="h-3 w-3" />
                        {member.role === MemberRole.LEADER ? 'Leader' : 'Member'}
                      </Badge>
                      
                      {!isLeader && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleUpdateRole(member.id, MemberRole.LEADER)}
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              Make Leader
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteMemberModal
        projectId={projectId}
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
      />
    </>
  );
};