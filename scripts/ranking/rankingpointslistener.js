/**
 * RankingPointsListener
 *
 * @return RankingPointsListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingdatalistener', 'math/vectormodel', //
  'options'
], function (extend, RankingDataListener, VectorModel, Options) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingPointsListener (ranking) {
    RankingPointsListener.superconstructor.call(this, ranking,
      new VectorModel())
  }
  extend(RankingPointsListener, RankingDataListener)

  RankingPointsListener.NAME = 'points'
  RankingPointsListener.DEPENDENCIES = undefined

  /**
   * insert the results of a game into the ranking.
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param result
   *          a game result
   */
  RankingPointsListener.prototype.onresult = function (r, e, result) {
    result.teams.forEach(function (teamid, index) {
      this.points.add(teamid, result.score[index])
    }, this)
  }

  /**
   * add bye points
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "bye"
   * @param teams
   *          an array of team ids
   */
  RankingPointsListener.prototype.onbye = function (r, e, data) {
    data.teams.forEach(function (teamid) {
      this.points.add(teamid, Options.byepointswon)
    }, this)
  }

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "correct"
   * @param correction
   *          a game correction
   */
  RankingPointsListener.prototype.oncorrect = function (r, e, correction) {
    correction.before.teams.forEach(function (teamid, index) {
      this.points.add(teamid, -correction.before.score[index])
    }, this)

    this.onresult(r, e, correction.after)
  }

  return RankingPointsListener
})
