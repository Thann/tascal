// CalendarPanel - wrapper for Full Calendar

import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import tasksPlugin from '../fc_tasks_plugin';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import 'styles/calendar_panel.css';

module.exports = Backbone.View.extend({
	id: 'CalendarPanel',
	events: {
		// 'click .door': 'openDoor',
	},
	initialize: function() {
		this.calendar = new Calendar(this.el, {
			defaultView: 'tasks',
			plugins: [
				interactionPlugin,
				dayGridPlugin,
				timeGridPlugin,
				tasksPlugin,
				listPlugin,
			],
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'tasks,listDay,timeGridDay,timeGridWeek,dayGridMonth',
			},
			navLinks: true, // can click day/week names to navigate views
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			events: [
				{
					title: 'All Day Event',
					start: new Date().setHours(0),
				}, {
					title: 'get up ',
					start: new Date().setHours(8, 30, 0, 0),
					allDay: false,
				}, {
					title: 'brush teeth',
					start: new Date().setHours(8, 30, 0, 0),
					allDay: false,
				}, {
					title: 'eat breakfast',
					start: new Date().setHours(8, 35, 0, 0),
					allDay: false,
				}, {
					title: 'go to work',
					start: new Date().setHours(9, 0, 0, 0),
					end: new Date().setHours(12, 0, 0, 0),
					location: '//WORK//',
					allDay: false,
				}, {
					title: 'lunch!',
					start: new Date().setHours(12, 0, 0, 0),
					end: new Date().setHours(13, 0, 0, 0),
					location: '//WORK//',
					allDay: false,
				}, {
					title: 'go back to work',
					start: new Date().setHours(13, 0, 0, 0),
					end: new Date().setHours(17, 0, 0, 0),
					location: '//WORK//',
					allDay: false,
				}, {
					title: 'go home!',
					start: new Date().setHours(17),
					location: '//HOME//',
					allDay: false,
				}, {
					title: 'bedtime',
					start: new Date().setHours(22),
					location: '//HOME//',
					allDay: false,
				},
			],
			eventClick() {
				console.log(" BCKONBONE CLICK!!")
			}
		});
	},
	render: function() {
		this.calendar.render();
		return this;
	},
});
