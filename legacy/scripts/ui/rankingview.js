/**
 * RankingView
 *
 * @return RankingView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/templateview', './strings', './listcollectormodel',
    './teammodel'], function(extend, TemplateView, Strings, ListCollectorModel,
    TeamModel) {
  /**
   * Constructor
   *
   * @param model
   *          a RankingModel instance
   * @param $view
   *          a jQuery object representing a RankingView table
   * @param teamList
   *          a ListModel of TeamModel instances, to which the team ids are
   *          corresponding
   * @param abbreviate
   *          a ValueModel instance which indicates whether this
   */
  function RankingView(model, $view, teamList, abbreviate) {
    RankingView.superconstructor.call(this, model, $view, $view
        .find('.rankingrow.template'));

    this.$rankingheader = this.$view.find('.rankingheader');
    this.$headercomponenttemplate = this.$rankingheader.find('.component');
    this.$headercomponenttemplate.detach();
    this.$headernametemplate = this.$rankingheader.find('.name');
    this.$headernametemplate.detach();
    this.$nametemplate = this.$template.find('.name').detach();
    this.$componenttemplate = this.$template.find('.component').detach();

    this.teamList = teamList;
    this.abbreviate = abbreviate;

    this.updateTimeout = undefined;

    // TODO use some standardized defer-statement
    this.onupdate(this.model, 'update');

    this.teamCollector = new ListCollectorModel(this.teamList, TeamModel);

    this.teamCollector.registerListener(this);
    this.abbreviate.registerListener(this);
  }
  extend(RankingView, TemplateView);

  RankingView.prototype.reset = function() {
    this.$view.find('.rankingrow').remove();
  };

  RankingView.prototype.update = function() {
    var ranks, teamsize, i;

    ranks = this.model.get();
    if (!ranks) {
      return false;
    }

    this.reset();

    teamsize = 0;
    ranks.displayOrder.forEach(function(teamIndex) {
      var size = this.teamList.get(teamIndex)
          && this.teamList.get(teamIndex).length || 0;
      if (teamsize < size) {
        teamsize = size;
      }
    }, this);

    this.$view.find('.rankingheader .name').remove();
    for (i = 0; i < teamsize; i += 1) {
      this.$rankingheader.append(this.$headernametemplate.clone());
    }

    this.$view.find('.rankingheader .component').remove();
    ranks.components.forEach(function(componentName) {
      var name;
      if (this.useAbbreviations()) {
        name = Strings['ranking_short_' + componentName];
      } else {
        name = Strings['ranking_medium_' + componentName];
      }
      this.$rankingheader.append(this.$headercomponenttemplate.clone().text(
          name));
    }, this);

    ranks.displayOrder.forEach(function(teamIndex, rank) {
      var i, $row, team, player, $nametemplate;

      team = this.teamList.get(ranks.ids[teamIndex]);

      $row = this.$template.clone();
      $row.find('.rank').text(ranks.ranks[teamIndex] + 1);
      $row.find('.teamno').text(team.getID() + 1);

      for (i = 0; i < teamsize; i += 1) {
        player = team && team.getPlayer(i);
        $nametemplate = this.$nametemplate.clone();
        if (player) {
          $nametemplate.text(player.getName());
        }
        $row.append($nametemplate);
      }
      ranks.components.forEach(function(componentName) {
        $row.append(this.$componenttemplate.clone().text(
            ranks[componentName][teamIndex]));
      }, this);

      this.$view.append($row);
    }, this);
  };

  RankingView.prototype.onupdate = function(emitter, event, data) {
    var rankingview = this;
    if (this.updateTimeout === undefined) {
      this.updateTimeout = window.setTimeout(function() {
        rankingview.update();
        rankingview.updateTimeout = undefined;
      }, 1);
    }
  };

  RankingView.prototype.useAbbreviations = function() {
    return this.abbreviate.get();
  };

  return RankingView;
});
