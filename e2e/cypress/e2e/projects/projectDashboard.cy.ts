import { login } from '../../common/apiCalls/common';
import { projectListdData } from '../../common/apiCalls/testData/testData';
import { createComment, resolveComment } from '../../common/comments';
import { HOST } from '../../common/constants';
import { createProject, enterProject } from '../../common/projects';
import { selectInProjectMenu } from '../../common/shared';
import { getCell } from '../../common/state';
import { createTag } from '../../common/tags';
import { createTranslation } from '../../common/translations';

describe('Project stats', () => {
  beforeEach(() => {
    projectListdData.clean();
    projectListdData.generate();
    login('projectListDashboardUser', 'admin');
    cy.visit(HOST);
  });

  it('Activity', () => {
    createProject('Project with activity', 'Test User');
    enterProject('Project with activity');
    createTranslation('new translation', 'english translation');
    createTag('new tag');
    setStateToReviewed('english translation');
    createComment('new comment', 0, 'en');
    resolveComment('new comment');

    selectInProjectMenu('Project Dashboard');

    cy.gcy('activity-compact')
      .contains('Comment state change')
      .should('be.visible');
    cy.gcy('activity-compact').contains('Added comment').should('be.visible');
    cy.gcy('activity-compact')
      .contains('Set translation state')
      .should('be.visible');
    cy.gcy('activity-compact')
      .contains('Key tags updated')
      .should('be.visible');
    cy.gcy('activity-compact').contains('Created key').should('be.visible');
    cy.gcy('activity-compact').contains('Created project').should('be.visible');
  });

  it('Global statistics', () => {
    enterProject('Project 2');
    createTag('test_tag');
    selectInProjectMenu('Project Dashboard');
    cy.gcy('project-dashboard-language-count')
      .contains('2')
      .should('be.visible');

    cy.gcy('project-dashboard-key-count').contains('5').should('be.visible');
    cy.gcy('project-dashboard-base-word-count')
      .contains('4')
      .should('be.visible');
    cy.gcy('project-dashboard-translated-percentage')
      .contains('75%')
      .should('be.visible');
    cy.gcy('project-dashboard-reviewed-percentage')
      .contains('0%')
      .should('be.visible');
    cy.gcy('project-dashboard-tags').contains('1').should('be.visible');

    cy.gcy('project-dashboard-language-bar').first().trigger('mouseover');

    checkLabelRow('Translated', '100%', 3, 4);
    checkLabelRow('Untranslated', '0%', 2, 0);

    cy.gcy('project-dashboard-language-bar').first().trigger('mouseout');

    cy.wait(1000);

    cy.gcy('project-dashboard-language-bar').eq(1).trigger('mouseover');

    checkLabelRow('Reviewed', '0%', 1, 0);
    checkLabelRow('Translated', '75%', 2, 3);
    checkLabelRow('Untranslated', '25%', 2, 1);
  });
});

const checkLabelRow = (
  state: string,
  percentage: string,
  keys: number,
  words: number
) => {
  cy.gcy('project-dashboard-language-label-state')
    .contains(state)
    .should('be.visible')
    .next()
    .contains(percentage)
    .should('be.visible')
    .next()
    .contains(`${keys} key`)
    .should('be.visible')
    .next()
    .contains(`${words} word`)
    .should('be.visible');
};

const setStateToReviewed = (translationText: string) => {
  getCell(translationText)
    .trigger('mouseover')
    .findDcy('translation-state-button')
    .click();
};
