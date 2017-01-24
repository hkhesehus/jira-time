import React, { Component, PropTypes } from 'react';
import keycode from 'keycode';

import { TASKS_SORT_ORDERS } from 'store/reducers/tasks';
import IconDown from 'assets/down.svg';

import './TasksHeader.scss';

export default class TasksHeader extends Component {

    static propTypes = {
        tasksSortOrder: PropTypes.string,
        tasksSearch: PropTypes.string,
        setTasksSortOrder: PropTypes.func.isRequired,
        setTasksSearch: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.onSortClick = this.onSortClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onDeleteSearchText = this.onDeleteSearchText.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
        this.state = {
            deleteButton: false
        }
    }

    componentDidMount () {
        document.addEventListener('keydown', this.onDocumentKeyDown, false);
        if (this.search.value.length) {
            this.setState({ deleteButton: true });
        }
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this.onDocumentKeyDown);
    }

    onDocumentKeyDown (e) {
        const code = keycode(e);
        if (code === 'f') {
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
                this.search.select();
            }
        } else if (code === 'esc') {
            if (this.inputFocusing) {
                this.search.blur();
                this.onDeleteSearchText();
            }
        }
    }

    onSortClick () {
        let { tasksSortOrder } = this.props;

        if (tasksSortOrder === TASKS_SORT_ORDERS[0]) {
            tasksSortOrder = TASKS_SORT_ORDERS[1];
        } else {
            tasksSortOrder = TASKS_SORT_ORDERS[0];
        }

        this.props.setTasksSortOrder({
            sortOrder: tasksSortOrder
        });
    }
    onDeleteSearchText () {
        this.search.value = '';
        this.props.setTasksSearch({ search: '' });
        this.setState({
            deleteButton: false
        });
    }
    onInputChange (e) {
        this.props.setTasksSearch({ search: e.target.value });
        if (e.target.value.length) {
            this.setState({
                deleteButton: true
            });
        } else {
            this.setState({
                deleteButton: false
            });
        }
    }

    render () {

        const { tasksSortOrder, tasksSearch } = this.props;

        let sortOrderDisplay = '-';
        if (TASKS_SORT_ORDERS.includes(tasksSortOrder)) {
            sortOrderDisplay = tasksSortOrder;
        }

        // Output the list of tasks
        return (
            <div className='tasks-header'>
                <div
                  className={'tasks-header-sorting tasks-header-sorting--' + sortOrderDisplay}
                  onClick={this.onSortClick}
                  title={sortOrderDisplay}
                >
                    Sort:
                    <img
                      className='tasks-header-sorting-icon'
                      src={IconDown}
                      alt={sortOrderDisplay}
                    />
                </div>
                <div className='tasks-header-search'>
                    <input
                      className='input-field tasks-header-search-input'
                      value={tasksSearch}
                      onChange={this.onInputChange}
                      onFocus={() => this.inputFocusing = true}
                      onBlur={() => this.inputFocusing = false}
                      ref={e => this.search = e}
                    />
                    {
                         this.state.deleteButton ? <span className='tasks-header-search-delete'
                           onClick={this.onDeleteSearchText}>x</span> : null
                    }
                </div>
            </div>
        );
    }
}
