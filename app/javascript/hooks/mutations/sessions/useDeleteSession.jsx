// BigBlueButton open source conferencing system - http://www.bigbluebutton.org/.
//
// Copyright (c) 2022 BigBlueButton Inc. and by respective authors (see below).
//
// This program is free software; you can redistribute it and/or modify it under the
// terms of the GNU Lesser General Public License as published by the Free Software
// Foundation; either version 3.0 of the License, or (at your option) any later
// version.
//
// Greenlight is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License along
// with Greenlight; if not, see <http://www.gnu.org/licenses/>.

import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../../../helpers/Axios';
import { useAuth } from '../../../contexts/auth/AuthProvider';

export default function useDeleteSession({ showToast = true }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setStateChanging } = useAuth();

  return useMutation(
    () => axios.delete('/sessions/signout.json'),
    {
      onSuccess: async ({ data }) => {
        const logoutUrl = data?.data;

        if (typeof logoutUrl === 'string') {
          window.location.href = logoutUrl;
        } else {
          setStateChanging(true);
          queryClient.refetchQueries('useSessions');

          await navigate('/');
          if (showToast) { toast.success(t('toast.success.session.signed_out')); }
          setStateChanging(false);
        }
      },
      onError: () => {
        toast.error(t('toast.error.problem_completing_action'));
      },
    },
  );
}
