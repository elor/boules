/**
 * KOTournamentView
 *
 * @return KOTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/tournamentview', 'core/valuemodel', 'ui/checkboxview',
  'ui/kotournamentcontroller'], function (extend, TournamentView, ValueModel,
  CheckBoxView, KOTournamentController) {
  /**
   * Constructor
   *
   * @param model
   *          a RoundTournamentModel instance
   * @param $view
   *          a DOM element to fill
   */
  function KOTournamentView (model, $view, tournaments) {
    KOTournamentView.superconstructor.call(this, model, $view, tournaments)

    // set the initial value of the ValueModel
    this.model.initialByes = new ValueModel(this.model.tournament
      .getProperty('initialbyes'))
    // use checkboxes
    this.initialbyescheckboxview = new CheckBoxView(this.model.initialByes, //
      this.$view.find('.initial .tournamentoptions .option input.initialbyes'))

    // read the ko mode
    this.$view.find('.tournamentoptions .option select.mode').val(
      this.model.tournament.getProperty('komode'))

    this.subcontroller = new KOTournamentController(this)
  }
  extend(KOTournamentView, TournamentView)

  return KOTournamentView
})
