import React, { Fragment, createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from '../components/RepoCreateForm';
import { AppContext } from '../router';
import { createLocalCommitsList, createRepository, getLocalRepositoriesList, getRemoteCommitList } from '../api/CommitAPI';

export const RepoCreateContainerContext = createContext({});

const RepoCreateContainer = ({ successMessage }) => {
  const { csrftoken, username } = useContext(AppContext);
  const [repositoryData, setRepositoryData] = useState({ name: undefined });
  const [localRepositories, setLocalRepositories] = useState([]);
  const { data } = getRemoteCommitList(repositoryData ? repositoryData.name : undefined);
  const { data: localRepositoriesList } = getLocalRepositoriesList();

  const submit = (values, dispatch) => {
    const [, name] = values.repositoryName.split('/');
    return createRepository({ name }, { 'X-CSRFToken': csrftoken }, dispatch).then((data) => {
      setRepositoryData(data);
    });
  };

  useEffect(() => {
    if (localRepositoriesList) {
      setLocalRepositories(localRepositoriesList);
    }
  }, [localRepositoriesList]);

  useEffect(() => {
    if (data && data.length > 0) {
      const commitsList = data.map(({
        author,
        commit: { author: { date, name },
          message,
        },
        html_url,
        sha
      }) => ({
        message,
        sha,
        author: `${author ? `${author.login} - ` : ''}${name}`,
        url: html_url,
        avatar: author ? author.avatar_url : undefined,
        date,
        repository: repositoryData.id,
      }));

      createLocalCommitsList(commitsList, repositoryData.name, { 'X-CSRFToken': csrftoken }).then(() => {
        location.replace(location.href);
      });
    }
  }, [data]);

  return (
    <RepoCreateContainerContext.Provider value={{ localRepositories }}>
      <div className='user-name-field'>
        <p className='user-name-label'>Username: </p>
        <h6>{username}</h6>
      </div>

      <Form onSubmit={submit} successMessage={successMessage} />
    </RepoCreateContainerContext.Provider>
  );
}

RepoCreateContainer.propTypes = {
  successMessage: PropTypes.bool.isRequired,
};

const mapStateToProps = store => ({
  successMessage: store.commitState.successMessage,
});

export default connect(mapStateToProps)(RepoCreateContainer);
