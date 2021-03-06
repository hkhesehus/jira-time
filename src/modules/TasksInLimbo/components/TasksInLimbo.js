import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Records from 'modules/Records';
import RecordActionButtons from 'modules/RecordActionButtons';

import './TasksInLimbo.scss';

export default class TasksInLimbo extends Component {
    static propTypes = {
        movingRecord: PropTypes.object,
        recordsWithNoIssue: PropTypes.array.isRequired
    };

    render() {
        const { profile, movingRecord, recordsWithNoIssue } = this.props;
        const { verticalLimboSplit } = profile.preferences;

        let textInLimbo;
        switch (recordsWithNoIssue.length) {
            case 0: {
                textInLimbo = 'No work logs in limbo!';
                break;
            }
            case 1: {
                textInLimbo = 'Just one work log in limbo';
                break;
            }
            case 2:
            case 3:
            case 4: {
                textInLimbo = `${recordsWithNoIssue.length} work logs in limbo`;
                break;
            }
            default: {
                textInLimbo = `Oh dear. You have ${recordsWithNoIssue.length} work logs in limbo`;
                break;
            }
        }

        let className = 'task task--limbo';
        if (movingRecord && !movingRecord.taskDroppableCuid) {
            className += ' task--drop-active';
        }

        const containerClassName = `task-limbo-container ${verticalLimboSplit ? 'task-limbo-container--vertical' : ''}`;

        // Output the list of tasks
        return (
            <div className={containerClassName}>
                <div className={className}>
                    <div className="task--limbo-header">
                        {textInLimbo}
                        <RecordActionButtons />
                    </div>
                    <Records records={recordsWithNoIssue} />
                </div>
            </div>
        );
    }
}
