import React from 'react';
import PropTypes from 'prop-types';

const CommitList = (props) => {
  const { commits } = props;
  return (
    <div>
      {commits.length !== 0 && (
        <div>
          <div className="card card-outline-secondary my-4">
            <div className="card-header">
              Commit List
            </div>

            <div className="card-body">
              {commits.map((commit, index) => (
                <div key={commit.sha}>
                  <div className="avatar">
                    {
                      commit.avatar ?
                        <img alt={commit.author} className="img-author" src={commit.avatar} />
                        :
                        <i aria-label={commit.author} className="fa fa-github w-100 h-100 avatar-icon"></i>
                    }
                  </div>
                  <div className="commit-details">
                    <p>
                      {commit.message}
                    </p>
                    <small className="text-muted">
                      {commit.author} authored on {commit.repository} at {commit.date}
                    </small>
                    {index !== commits.length - 1 && <hr />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CommitList.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommitList;
