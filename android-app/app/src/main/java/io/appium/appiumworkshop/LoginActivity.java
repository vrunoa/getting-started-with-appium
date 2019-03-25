package io.appium.appiumworkshop;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Button beginBtt = findViewById(R.id.beginBtt);
        beginBtt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clearAlert();
                validateForm();
            }
        });
    }

    private void clearAlert() {
        TextView alertText = findViewById(R.id.alertText);
        alertText.setText("");
    }

    private void showAlert(int msg) {
        TextView alertText = findViewById(R.id.alertText);
        alertText.setText(msg);
    }

    private void validateForm() {
        EditText editText = findViewById(R.id.editText);
        String username = editText.getText().toString().trim();
        if (username.equalsIgnoreCase("")) {
            showAlert(R.string.please_set_ur_name);
            return;
        }
        CheckBox agreeBox = findViewById(R.id.checkbox);
        if (!agreeBox.isChecked()) {
            showAlert(R.string.please_agree_have_fun);
            return;
        }
        clearAlert();
        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
        intent.putExtra("SESSION_USERNAME", username);
        startActivity(intent);
    }
}
