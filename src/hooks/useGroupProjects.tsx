import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupProjectsApi } from '@/services/api';
import { GroupMember, InviteMemberRequest, UpdateMemberRoleRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ['projectMembers', projectId],
    queryFn: () => groupProjectsApi.getProjectMembers(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, invitation }: { projectId: string; invitation: InviteMemberRequest }) =>
      groupProjectsApi.inviteMember(projectId, invitation),
    onSuccess: (newMember: GroupMember) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', newMember.project_id] });
      toast({
        title: 'Member invited',
        description: `${newMember.user_email} has been invited to the project.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to invite member',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, memberId, updates }: { projectId: string; memberId: string; updates: UpdateMemberRoleRequest }) =>
      groupProjectsApi.updateMemberRole(projectId, memberId, updates),
    onSuccess: (updatedMember: GroupMember) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', updatedMember.project_id] });
      toast({
        title: 'Member role updated',
        description: `${updatedMember.user_name}'s role has been updated.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update member role',
        variant: 'destructive',
      });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      groupProjectsApi.removeMember(projectId, memberId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] });
      toast({
        title: 'Member removed',
        description: 'The member has been removed from the project.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove member',
        variant: 'destructive',
      });
    },
  });
};

export const useAvailableUsers = (query: string) => {
  return useQuery({
    queryKey: ['availableUsers', query],
    queryFn: () => groupProjectsApi.getAvailableUsers(query),
    enabled: query.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};