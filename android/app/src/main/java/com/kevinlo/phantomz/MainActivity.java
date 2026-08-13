package com.kevinlo.phantomz;

import android.os.Bundle;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // Allow the game to draw behind the system bars
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // Hide status bar + navigation bar
        hideSystemBars();
    }

    private void hideSystemBars() {
        WindowCompat.getInsetsController(
                getWindow(),
                getWindow().getDecorView()
        ).hide(WindowInsetsCompat.Type.systemBars());
    }
}