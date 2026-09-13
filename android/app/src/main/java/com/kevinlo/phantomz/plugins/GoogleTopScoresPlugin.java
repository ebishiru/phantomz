package com.kevinlo.phantomz.plugins;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.games.AnnotatedData;
import com.google.android.gms.games.LeaderboardsClient;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.games.leaderboard.LeaderboardScore;
import com.google.android.gms.games.leaderboard.LeaderboardScoreBuffer;
import com.google.android.gms.games.leaderboard.LeaderboardVariant;

@CapacitorPlugin(name = "GoogleTopScores")
public class GoogleTopScoresPlugin extends Plugin {
    @PluginMethod
    public void loadTopScores(PluginCall call) {
        String leaderboardId = call.getString("leaderboardID");
        if (leaderboardId == null || leaderboardId.isEmpty()) {
            call.reject("leaderboardID is required");
            return;
        }

        LeaderboardsClient leaderboardsClient = PlayGames.getLeaderboardsClient(getActivity());
        leaderboardsClient.loadTopScores(
                leaderboardId,
                LeaderboardVariant.TIME_SPAN_ALL_TIME,
                LeaderboardVariant.COLLECTION_PUBLIC,
                10
        ).addOnSuccessListener(annotatedData -> {
            AnnotatedData<LeaderboardsClient.LeaderboardScores> data = annotatedData;
            LeaderboardsClient.LeaderboardScores leaderboardScores = data.get();
            JSArray scores = new JSArray();

            if (leaderboardScores != null) {
                LeaderboardScoreBuffer scoreBuffer = leaderboardScores.getScores();
                for (LeaderboardScore score : scoreBuffer) {
                    JSObject entry = new JSObject();
                    entry.put("rank", score.getRank());
                    entry.put("name", score.getScoreHolderDisplayName());
                    entry.put("score", score.getRawScore());
                    scores.put(entry);
                }
                scoreBuffer.release();
            }

            JSObject result = new JSObject();
            result.put("scores", scores);
            call.resolve(result);
        }).addOnFailureListener(error -> call.reject("Error getting leaderboard scores: " + error.getMessage()));
    }
}
