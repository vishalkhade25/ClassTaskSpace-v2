import cron from 'node-cron';

import { sendDeadlineWarnings, sendDeadlinePassedWarnings } from '../utils/deadlineChecker.js';

const assignmentDeadlineCron = () => {
    cron.schedule("*/30 * * * *", async () => {
        console.log("Checking assignment deadlines...")

        try {
            await sendDeadlineWarnings();
            await sendDeadlinePassedWarnings();
            console.log("Deadline check completed.");
        } catch (error) {
            console.error("Deadline cron failed:", error.message);
        }
    });

    console.log("Assignment cron started.");
};

export default assignmentDeadlineCron;