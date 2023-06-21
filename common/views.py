from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic, View
from django.shortcuts import render
from decouple import config

class LoginView(generic.TemplateView):
    template_name = "common/login.html"


class HomeView(LoginRequiredMixin, View):
    template_name = "common/index.html"

    def get(self, request, *args, **kwargs):
        context = {
                "extra_data": {
                   "personalToken": config('GITHUB_PERSONAL_TOKEN')
                }
        }
         
        return render(request, self.template_name, context)
