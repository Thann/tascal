// Layout - The parent view of the whole app, and also the router.

require('styles/layout.css');

const UserModel = require('models/user.js');

module.exports = Backbone.View.extend({
	el: 'body',
	template: `
		<div data-subview="header"></div>
		<div class="main-bar">
			<div data-subview="sidebar"></div>
			<div class="main-panel">...</div>
		</div>
		<div class="footer hidden"></div>
	`,
	loading: true,
	events: {
		'click #Header .toggle-left-sidebar': function() {
			this.subviews.sidebar.toggle();
		},
	},
	subviewCreators: {
		form: function() { return new Tascal.Views.FormPanel(); },
		user: function() { return new Tascal.Views.UserPanel(); },
		admin: function() { return new Tascal.Views.AdminPanel(); },
		login: function() { return new Tascal.Views.LoginPanel(); },
		create: function() { return new Tascal.Views.CreatePanel(); },
		feedbacks: function() { return new Tascal.Views.TascalsPanel(); },
		header: function() { return new Tascal.Views.Header(); },
		sidebar: function() { return new Tascal.Views.Sidebar(); },
	},
	initialize: function() {
		const layout = this;
		this.loading = true;
		Backbone.Subviews.add( this );

		Tascal.Router = new (Backbone.Router.extend({
			routes: {
				'': 'login',
				'login': 'login',
				'admin': 'admin',
				//TODO: replace "create" with "form" edit mode
				'create': 'create',
				'user/:id': 'user',
				':form/feedback': 'feedbacks',
				':form/feedback/:fbid': 'feedbacks',
				'*notFound': 'form',
			},
			unauthRoutes: ['form', 'login'],
			execute: function(cb, args, name) {
				this.args = args;
				if (!layout.loading && !Tascal.User.isAuthed
						&& !this.lastRouteUnauthed()) {
					this.navigate('login', {trigger: true});
				} else if (!Tascal.Router.name
						&& layout.subviewCreators[name]) {
					this.lastRoute = name;
					layout.render(name);
				} else {
					// route not found
					this.navigate('', {trigger: true});
				}
			},
			lastRouteUnauthed: function() {
				return this.unauthRoutes.indexOf(this.lastRoute) >= 0;
			},
		}))();

		Tascal.User = new UserModel();
		this.listenTo(Tascal.User, 'relog', function(loggedIn) {
			if (loggedIn || Tascal.Router.lastRouteUnauthed()) {
				layout.render();
			} else {
				Tascal.Router.navigate('login', {trigger: false});
				layout.render('login');
			}
		});

		Tascal.Settings = new (Backbone.Model.extend({
			url: '/api/v1/site/settings',
		}))();
		Tascal.Settings.fetch();
		// Fetch on user sync?

		this.setTitle();
		Backbone.history.start();
		Tascal.User.init();
	},
	setTitle: function() {
		document.title = 'Tascal '+(
			Tascal.AppConfig.OrgName? ' - '+Tascal.AppConfig.OrgName : '');
	},
	render: function(tmpl) {
		this.$el.html(this.template);
		if (tmpl)
			this._current_template = `<div data-subview="${tmpl}"></div>`;
		if (!this.loading) {
			this.$('.main-panel').html(this._current_template);
		}
		this.loading = false;
		return this;
	},
});
