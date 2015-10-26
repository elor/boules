/**
 * SystemTableRowView
 *
 * @return SystemTableRowView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './teamview', './newtournamentview',
    './generictournamentview'], function(extend, View, TeamView,
    NewTournamentView, GenericTournamentView) {
  /**
   * Constructor
   *
   * @param index
   *          the team index for this line
   * @param $view
   *          the DOM element of a single table row
   * @param teams
   *          a ListModel of TeamModels
   * @param tournaments
   *          a ListModel of TournamentModels
   * @param viewPopulator
   *          a TournamentViewPopulator instance for creation of the ".system"
   *          cells
   */
  function SystemTableRowView(index, $view, teams, tournaments, viewPopulator,
      $newTournamentTemplate) {
    SystemTableRowView.superconstructor.call(this, undefined, $view);

    this.teamID = index;
    this.teams = teams;
    this.tournaments = tournaments;
    this.teamView = new TeamView(teams.get(index), this.$view);

    this.tournamentRank = -1;
    this.globalRank = -1;

    this.updatepending = undefined;

    this.$tournamentrank = this.$view.find('.tournamentrank');
    this.$globalrank = this.$view.find('.rank');
    this.tournamentView = undefined;
    this.viewPopulator = viewPopulator;

    this.tournaments.registerListener(this);

    this.updateRankTexts();
    this.updateSystem();

    this.teams.registerListener(this);
  }
  extend(SystemTableRowView, View);

  SystemTableRowView.prototype.updateRankTexts = function() {
    var ranking, globalRank, tournamentRank;

    ranking = this.tournaments.getGlobalRanking(this.teams.length);
    globalRank = ranking.globalRanks[this.teamID];
    tournamentRank = ranking.tournamentRanks[this.teamID];

    if (this.globalRank !== globalRank) {
      this.$globalrank.text(globalRank + 1);
      this.globalRank = globalRank;

      this.updateLastRowClass(ranking);
    }

    if (this.tournamentRank !== tournamentRank) {
      this.$tournamentrank.text(tournamentRank + 1);
      this.tournamentRank = tournamentRank;
    }
  };

  /**
   * adds/removes the .lastrow class on demand
   *
   * @param ranking
   *          a global ranking object
   */
  SystemTableRowView.prototype.updateLastRowClass = function(ranking) {
    var tournamentID, displayID, nextTeamID, nextTournamentID;

    tournamentID = ranking.tournamentIDs[this.teamID];
    displayID = ranking.displayOrder.indexOf(this.teamID);
    if (displayID + 1 == ranking.displayOrder.length) {
      this.$view.addClass('lastrow');
      return;
    }

    nextTeamID = ranking.displayOrder[displayID + 1];
    nextTournamentID = ranking.tournamentIDs[nextTeamID];

    if (tournamentID !== nextTournamentID) {
      this.$view.addClass('lastrow');
    } else {
      this.$view.removeClass('lastrow');
    }
  };

  /**
   * finds out if the current team is the first team in the tournament and
   * creates a new TournamentView, if necessary.
   */
  SystemTableRowView.prototype.updateSystem = function() {
    // too many variables.
    // TODO extract methods + reduce variables
    var ranking, displayID, tournamentID, isFirstInTournament, previousTeamID;
    var rankingLength, nextDisplayID, nextTeamID, tournamentSize, tournament;

    ranking = this.tournaments.getGlobalRanking(this.teams.length);
    displayID = ranking.displayOrder.indexOf(this.teamID);
    tournamentID = ranking.tournamentIDs[this.teamID];

    isFirstInTournament = false;
    if (displayID === 0) {
      isFirstInTournament = true;
    } else {
      previousTeamID = ranking.displayOrder[displayID - 1];

      if (ranking.tournamentIDs[previousTeamID] !== tournamentID) {
        isFirstInTournament = true;
      }
    }

    if (this.tournamentView) {
      this.tournamentView.$view.remove();
      this.tournamentView.destroy();
      this.tournamentView = undefined;
      this.$view.removeClass('firstrow');
    }

    if (!isFirstInTournament) {
      return;
    }

    rankingLength = ranking.displayOrder.length;
    nextDisplayID = displayID + 1;
    for (; nextDisplayID < rankingLength; nextDisplayID += 1) {
      nextTeamID = ranking.displayOrder[nextDisplayID];
      if (ranking.tournamentIDs[nextTeamID] !== tournamentID) {
        break;
      }
    }

    tournamentSize = nextDisplayID - displayID;

    $view = $('<td>').addClass('system');

    tournament = this.tournaments.get(tournamentID);
    this.viewPopulator.populate(tournament, $view);

    if (tournament) {
      this.tournamentView = new GenericTournamentView(tournament, $view,
          this.tournaments);
    } else {
      this.tournamentView = new NewTournamentView(displayID, tournamentSize,
          $view, this.tournaments, this.teams);
    }

    this.$view.append($view);
    this.$view.addClass('firstrow');
  };

  SystemTableRowView.prototype.onupdate = function(emitter, event, data) {
    var rowview = this;
    if (emitter === this.tournaments) {
      if (this.updatepending === undefined) {
        this.updatepending = true;
        window.setTimeout(function() {
          rowview.updateRankTexts();
          rowview.updateSystem();
          rowview.updatepending = undefined;
        }, 1);
      }
    }
  };

  SystemTableRowView.prototype.oninsert = function(emitter, event, data) {
    if (emitter === this.teams) {
      this.updateSystem();
    }
  };

  SystemTableRowView.prototype.onremove = function(emitter, event, data) {
    if (emitter === this.teams) {
      this.updateSystem();
    }
  };

  /**
   * @param teams
   * @param tournaments
   * @param viewPopulator
   * @return {Function}
   */
  SystemTableRowView.bindLists = function(teams, tournaments, viewPopulator) {
    function BoundSystemTableRowView(index, $view) {
      BoundSystemTableRowView.superconstructor.call(this, index, $view, teams,
          tournaments, viewPopulator);
    }
    extend(BoundSystemTableRowView, SystemTableRowView);

    return BoundSystemTableRowView;
  };

  return SystemTableRowView;
});
