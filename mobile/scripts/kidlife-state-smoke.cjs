const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  module._compile(output, filename);
};

const storeModule = require('../src/shared/store/kidlifeSlice.ts');
const {
  acknowledgePenalty,
  addStoryToChildLibrary,
  addTask,
  claimQuizReward,
  equipPetItem,
  feedPet,
  inviteFamilyMember,
  issuePenalty,
  kidlifeReducer,
  requestReward,
  reviewRedemption,
  reviewSubmission,
  reviewWish,
  sendWish,
  setInterestRate,
  submitTask,
  toggleSubtask,
  transferSavings,
} = storeModule;

let state = kidlifeReducer(undefined, { type: '@@smoke/init' });
const reduce = (action) => {
  state = kidlifeReducer(state, action);
};

const initialTaskCount = state.tasks.length;
reduce(addTask({
  title: 'Nhiệm vụ smoke test',
  time: '18:30 - 19:00',
  rewardXP: 80,
  category: 'Tự lập',
  subtasks: ['Bước một', 'Bước hai'],
}));
assert.equal(state.tasks.length, initialTaskCount + 1);
const task = state.tasks[0];
task.subtasks.forEach((subtask) => reduce(toggleSubtask({ taskId: task.id, subtaskId: subtask.id })));
assert.equal(state.tasks[0].status, 'in_progress');

const submissionCount = state.submissions.length;
reduce(submitTask({ taskId: task.id }));
assert.equal(state.submissions.length, submissionCount + 1);
assert.equal(state.tasks[0].status, 'submitted');

const walletBeforeApproval = state.wallet.balance;
const submission = state.submissions[0];
reduce(reviewSubmission({ submissionId: submission.id, approved: true }));
assert.equal(state.tasks[0].status, 'done');
assert.equal(state.wallet.balance, walletBeforeApproval + 80);

const walletBeforeWish = state.wallet.balance;
reduce(sendWish({ text: 'Đi công viên cuối tuần', hasRecording: true }));
const wish = state.wishes[0];
assert.equal(state.wallet.balance, walletBeforeWish - 50);
reduce(reviewWish({ wishId: wish.id, status: 'rejected', feedback: 'Hẹn con tuần sau nhé.' }));
assert.equal(state.wallet.balance, walletBeforeWish);

const walletBeforeSaving = state.wallet.balance;
const savingsBefore = state.wallet.savingsBalance;
reduce(transferSavings({ direction: 'deposit', amount: 100 }));
assert.equal(state.wallet.balance, walletBeforeSaving - 100);
assert.equal(state.wallet.savingsBalance, savingsBefore + 100);
reduce(transferSavings({ direction: 'withdraw', amount: 100 }));
assert.equal(state.wallet.balance, walletBeforeSaving);
assert.equal(state.wallet.savingsBalance, savingsBefore);
reduce(setInterestRate(7));
assert.equal(state.wallet.interestRate, 7);

reduce(issuePenalty({ reason: 'Chơi game quá giờ', amount: 30 }));
assert.equal(state.wallet.balance, walletBeforeSaving - 30);
assert.equal(state.penalties[0].status, 'issued');
reduce(acknowledgePenalty(state.penalties[0].id));
assert.equal(state.penalties[0].status, 'resolved');

const activeReward = state.rewards.find((reward) => reward.active && reward.cost <= state.wallet.balance);
assert.ok(activeReward);
const walletBeforeReward = state.wallet.balance;
reduce(requestReward(activeReward.id));
const redemption = state.redemptionRequests[0];
assert.equal(redemption.status, 'pending');
assert.equal(state.wallet.balance, walletBeforeReward);
reduce(reviewRedemption({ requestId: redemption.id, approved: true }));
assert.equal(state.wallet.balance, walletBeforeReward - activeReward.cost);

const memberCount = state.familyMembers.length;
reduce(inviteFamilyMember({
  name: 'Bà Mai',
  phone: '0976543210',
  role: 'grandparent',
}));
assert.equal(state.familyMembers.length, memberCount + 1);
assert.equal(state.familyMembers.at(-1).status, 'pending');

reduce(addStoryToChildLibrary('ext5'));
assert.ok(state.childStoryIds.includes('ext5'));

const walletBeforePet = state.wallet.balance;
reduce(feedPet());
assert.equal(state.pet.fed, true);
assert.equal(state.wallet.balance, walletBeforePet - 10);
reduce(equipPetItem({ name: 'Kính mát', cost: 20, owned: false }));
assert.ok(state.pet.ownedItems.includes('Kính mát'));
assert.equal(state.wallet.balance, walletBeforePet - 30);

const walletBeforeQuiz = state.wallet.balance;
reduce(claimQuizReward({ quizId: 'smoke-quiz', amount: 30 }));
reduce(claimQuizReward({ quizId: 'smoke-quiz', amount: 30 }));
assert.equal(state.wallet.balance, walletBeforeQuiz + 30);

console.log('KidLife state smoke test: 10/10 luong nghiep vu dat.');
