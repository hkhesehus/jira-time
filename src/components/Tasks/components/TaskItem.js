import React, { Component, PropTypes } from 'react';
import TaskItemRecord from '../containers/TaskItemRecord';
import RecordModel from '../../Recorder/modules/RecordModel';

import LoadingIcon from '../../../assets/loading.svg';

import './TaskItem.scss';

export class TaskItem extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    records: PropTypes.array.isRequired,
    removeTask: PropTypes.func.isRequired,
    startRecording: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onLogClick = this.onLogClick.bind(this);
  }

  onRemoveClick () {
    this.props.removeTask({ cuid: this.props.task.cuid });
  }

  onLogClick () {
    const { task } = this.props;

    this.props.startRecording({
      task,
      record: RecordModel({ task })
    });
  }

  render () {

    const { task } = this.props;

    // Get the records for this task
    let records = [];
    this.props.records.forEach(record => {
      if (record.taskCuid === task.cuid) {
        records.push(record);
      }
    });

    let issueInfoAtEnd = <span className='task-item__info'>{task.issue.fields.timetracking.remainingEstimate}</span>;
    if (task.issueRefreshing) {
      issueInfoAtEnd = <span className='task-item__info'><img src={LoadingIcon} alt='Loading' className='task-item__loading' /></span>;
    }

    // Output the list of tasks
    return (
      <div className='task-item'>
        <div className='task-item-info'>
          <button className='task-item__remove' onClick={this.onRemoveClick}>x</button>
          <span className='task-item__key'>{task.issue.key}</span>
          <span className='task-item__summary'>{task.issue.fields.summary}</span>
          {issueInfoAtEnd}
          <button className='task-item__log' onClick={this.onLogClick}>+</button>
        </div>
        <div className='task-item-records'>
          {records.map((record, index) => (<TaskItemRecord recordCuid={record.cuid} record={record} key={index} />))}
        </div>
      </div>
    );
  }
}

export default TaskItem;
