/**
 * TournamentMatchesView
 *
 * @return TournamentMatchesView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/templateview', 'ui/listview',
  'ui/popoutboxview', 'ui/teamview', 'core/listener', 'ui/matchtableview',
  'ui/tournamentrenamecontroller'], function (extend, View, TemplateView,
  ListView, PopoutBoxView, TeamView, Listener, MatchTableView,
  TournamentRenameController) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel from which all matches are read
   * @param $view
   *          the container
   * @param teamlist
   *          a ListModel of all TeamModels. Is referenced by ID by
   *          model.getMatches()
   * @param teamsize
   *          a ValueModel which represents the number of players in a team
   */
  function TournamentMatchesView (model, $view, teamlist, teamsize) {
    var $popoutTemplate = $view.clone()
    TournamentMatchesView.superconstructor.call(this, model, $view, //
      $view.find('.template.voteview'))

    this.renameController = new TournamentRenameController(new View(model,
      this.$view.find('.tournamentname.rename')))
    this.boxview = new PopoutBoxView(this.$view, $popoutTemplate, function (
      $view) {
      return new TournamentMatchesView(model, $view, teamlist, teamsize)
    })

    this.$names = this.$view.find('.tournamentname')
    this.teamlist = teamlist
    this.teamsize = teamsize

    this.initMatches()

    this.initVotes()

    Listener.bind(this.model.getName(), 'update', this.updateNames.bind(this))

    this.updateNames()
  }
  extend(TournamentMatchesView, TemplateView)

  /**
   * initializes matchtable
   */
  TournamentMatchesView.prototype.initMatches = function () {
    this.$matchtable = this.$view.find('.matchtable')
    this.matchtable = new MatchTableView(this.model.getMatches(),
      this.$matchtable, this.teamlist, this.model, this.teamsize)

    Listener.bind(this.model.getMatches(), 'resize', this.updateVisibility
      .bind(this))

    this.updateVisibility()
  }

  TournamentMatchesView.prototype.updateVisibility = function () {
    if (this.model.getMatches().length === 0) {
      this.$view.addClass('hidden')
    } else {
      this.$view.removeClass('hidden')
    }
  }

  /**
   * initialize all vote lists and tables
   */
  TournamentMatchesView.prototype.initVotes = function () {
    var $votetemplate

    this.$view.find('.votelist').hide()

    $votetemplate = this.$template

    this.votelistmodels = this.model.VOTES.map(function (votetype) {
      var $votes, votelist

      $votes = this.$view.find('.votelist.' + votetype)
      if ($votes.length === 0) {
        return undefined
      }

      votelist = this.model.getVotes(votetype)

      // TODO use some shared View, e.g. ListEmptyView, to hide the whole
      // view when the list is empty
      Listener.bind(votelist, 'resize', function (emitter, event, data) {
        if (emitter.length === 0) {
          $votes.hide()
        } else {
          $votes.show()
        }
      })

      if (votelist.length !== 0) {
        $votes.show()
      }

      return new ListView(votelist, $votes, $votetemplate, TeamView, //
        this.teamlist)
    }, this)
  }

  TournamentMatchesView.prototype.updateNames = function () {
    this.$names.text(this.model.getName().get())
  }

  return TournamentMatchesView
})
