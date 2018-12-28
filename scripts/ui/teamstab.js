/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/view', 'ui/state', 'ui/newteamview',
  'ui/lengthview', 'ui/teamsizeview', 'ui/preregcloserview',
  'ui/checkboxview', 'core/classview', 'ui/tabshandle',
  'ui/teamsfileloadcontroller', 'presets', 'ui/noregmodel',
  'ui/deleteallteamscontroller', 'timemachine/timemachine',
  'core/valuemodel', 'ui/strings'
], function ($, extend, View, State, NewTeamView, LengthView, TeamSizeView,
  PreregCloserView, CheckBoxView, ClassView, TabsHandle,
  TeamsFileLoadController, Presets, NoRegModel, DeleteAllTeamsController,
  TimeMachine, ValueModel, Strings) {
  function TeamsTab ($tab) {
    TeamsTab.superconstructor.call(this, undefined, $tab)

    this.init()

    this.update()

    TimeMachine.commit.registerListener(this)
  }
  extend(TeamsTab, View)

  function sortTeamsByRankingPoints () {
    var teams
    teams = State.teams.asArray()
    teams.sort(function (a, b) {
      return b.rankingpoints - a.rankingpoints || a.getID() - b.getID()
    })

    State.teams.clear()
    teams.forEach(function (team) {
      State.teams.push(team)
    })
  }

  TeamsTab.prototype.init = function () {
    var $container, $button, value

    // teamsize bugfix
    if (State.teamsize.get() < Presets.registration.minteamsize) {
      State.teamsize.set(Presets.registration.minteamsize)
    }
    if (State.teamsize.get() > Presets.registration.maxteamsize) {
      State.teamsize.set(Presets.registration.maxteamsize)
    }

    // registration
    $container = this.$view.find('.newteamview')
    this.newTeamView = new NewTeamView(State.teams, $container, //
      State.teamsize)

    // number of teams
    $container = this.$view.find('.nextteamnumber')
    this.lengthView = new LengthView(State.teams, $container, +1)

    // change team size
    $container = this.$view.find('> .teamsizeview')
    if ($container.length !== 0) {
      this.teamSizeView = new TeamSizeView(State.teamsize, $container)
    }

    // hide team size buttons when a team has been registered
    this.teamSizeCloserView = new PreregCloserView(State.teams, this.$view)

    // hide registration and removal buttons after the first tournament
    this.noregmodel = new NoRegModel(State.tournaments)
    this.regVisibilityView = new ClassView(this.noregmodel, this.$view, 'noreg')

    // name maxwidth checkbox
    value = State.tabOptions.nameMaxWidth
    $container = this.$view.find('>.options input.maxwidth')
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container)
    this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
      'nomaxwidth')

    // player names checkbox
    value = State.tabOptions.showNames
    $container = this.$view.find('>.options input.shownames')
    this.showNamesCheckBoxView = new CheckBoxView(value, $container)
    this.showNamesClassView = new ClassView(value, this.$view, undefined,
      'hidenames')

    // team names checkbox
    value = State.tabOptions.showTeamName
    $container = this.$view.find('>.options input.showteamname')
    this.showTeamNameCheckBoxView = new CheckBoxView(value, $container)
    this.showTeamNameClassView = new ClassView(value, this.$view, undefined,
      'hideteamname')

    // rankingpoints checkbox
    value = new ValueModel(Presets.ui.rankingpoints)
    $container = this.$view.find('>.options input.rankingpoints')
    this.rankingpointsCheckBoxView = new CheckBoxView(value, $container)
    this.rankingpointsClassView = new ClassView(value, this.$view, undefined, 'hiderankingpoints')

    $button = this.$view.find('button.sortbyrankingpoints')
      .click(function (e) {
        if (window.confirm(Strings.confirm_team_sort_action)) {
          sortTeamsByRankingPoints()
        }
      })

    // update the tab when the team size changes
    if (Presets.registration.teamsizeicon) {
      TabsHandle.bindTabOpts('teams', State.teamsize)
    }

    $container = this.$view.find('button.deleteall')
    this.deleteAllTeamsController = new DeleteAllTeamsController(new View(
      this.noregmodel, $container))

    $button = this.$view.find('>button.fileloadteams')
    this.teamsFileLoadController = new TeamsFileLoadController($button)
  }

  TeamsTab.prototype.onupdate = function () {
    this.update()
  }

  TeamsTab.prototype.update = function () {
    if (TimeMachine.commit.get()) {
      TabsHandle.show('teams')
    } else {
      TabsHandle.hide('teams')
    }
  }

  // FIXME CHEAP HACK AHEAD
  $(function ($) {
    var $tab

    $tab = $('#tabs > [data-tab="teams"]')
    if ($tab.length && $('#testmain').length === 0) {
      return new TeamsTab($tab)
    }
  })

  return TeamsTab
})
