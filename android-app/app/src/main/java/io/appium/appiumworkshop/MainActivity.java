package io.appium.appiumworkshop;

import android.content.Intent;
import android.net.Uri;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.FrameLayout;

public class MainActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;
    private NavigationView navView;
    private FrameLayout frameLayout;
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        drawerLayout = findViewById(R.id.drawer_layout);
        
        String username = getIntent().getStringExtra("SESSION_USERNAME");
        if (username == null) username = "";
        
        
        Toolbar toolbar = findViewById(R.id.toolbar);
        toolbar.setTitle(getString(R.string.welcome_user, username));
        setSupportActionBar(toolbar);
        ActionBar actionbar = getSupportActionBar();
        actionbar.setDisplayHomeAsUpEnabled(true);
        //actionbar.setHomeAsUpIndicator(android.R.drawable.ic_menu);
        
        navView = findViewById(R.id.nav_view);
        frameLayout = findViewById(R.id.content_frame);
        
        webView = findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);

        Button bttTerms = navView.findViewById(R.id.bttTerms);
        bttTerms.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onBackPressed();
                webView.loadUrl("file:///android_asset/terms.html");
            }
        });

        Button bttConduct = navView.findViewById(R.id.bttConduct);
        bttConduct.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onBackPressed();
                webView.loadUrl("file:///android_asset/code_conduct.html");
            }
        });

        Button bttLocation = navView.findViewById(R.id.bttLocation);
        bttLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.ca/maps/place/Sheraton+Grand+Bangalore+Hotel+at+Brigade+Gateway/@13.0127271,77.5550357,15z/data=!4m7!3m6!1s0x0:0x6832860dbb5cd434!5m1!1s2018-10-28!8m2!3d13.0127271!4d77.5550357"));
                startActivity(browserIntent);
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                drawerLayout.openDrawer(GravityCompat.START);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        if(drawerLayout.isDrawerOpen(GravityCompat.START)){
            drawerLayout.closeDrawer(Gravity.LEFT);
        } else {
            drawerLayout.openDrawer(Gravity.LEFT);
        }
    }
}
