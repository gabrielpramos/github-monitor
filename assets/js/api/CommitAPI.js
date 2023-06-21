import axios from 'axios';
import { reset } from 'redux-form';
import store from '../store';
import {
  createCommitsListSuccess,
  createRepositorySuccess, getCommitsSuccess,
} from '../actions/CommitActions';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../router';

export const getCommits = () => axios.get(`/api/commits/`)
  .then((response) => {
    store.dispatch(getCommitsSuccess({ ...response.data }));
  });

export const createRepository = (values, headers, formDispatch) => axios.post('/api/repositories/', values, { headers })
  .then((response) => {
    store.dispatch(createRepositorySuccess(response.data, true));
    formDispatch(reset('repoCreate'));
    return response.data;
  }).catch((error) => {
    const err = error.response;
    console.log(err);
  });

export const getRepositories = () => {
  const { personalToken, username } = useContext(AppContext);
  const [response, setResponse] = useState([]);

  useEffect(() => {
    axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: {
        'Accept': "application/vnd.github+json",
        'Authorization': `Bearer ${personalToken}`
      }
    })
      .then((response) => { setResponse(response); });
  }, []);

  return response;
};

export const getRemoteCommitList = (repo) => {
  const { personalToken, username } = useContext(AppContext);
  const [response, setResponse] = useState([]);

  useEffect(() => {
    if (repo && repo.length > 0) {
      axios.get(`https://api.github.com/repos/${username}/${repo}/commits`, {
        headers: {
          'Accept': "application/vnd.github+json",
          'Authorization': `Bearer ${personalToken}`
        }
      }).then((response) => { setResponse(response); });
    }
  }, [repo]);

  return response;
}

export const createLocalCommitsList = (values, repositoryName, headers) => {
  return axios.put(`/api/commits/create/${repositoryName}`, values, { headers })
    .then((response) => {
      store.dispatch(createCommitsListSuccess(response.data, true));
    }).catch((error) => {
      const err = error.response;
      console.log(err);
    })
};

export const getLocalRepositoriesList = () => {
  const {
  } = useContext(AppContext);
  const [response, setResponse] = useState([]);

  useEffect(() => {
    axios.get(`/api/repositories/list`)
      .then((response) => {
        setResponse(response);
      })
  }, []);

  return response;
};
