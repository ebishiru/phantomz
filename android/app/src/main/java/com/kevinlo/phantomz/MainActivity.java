package com.kevinlo.phantomz;

import android.os.Bundle;
import android.view.Window;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // Make the app draw behind the Android system bars
        WindowCompat.setDecorFitsSystemWindows(window, false);
    }
}